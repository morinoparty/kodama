import { env } from "cloudflare:workers";
import { getRequest } from "@tanstack/react-start/server";
import { getAuth } from "./auth";

/**
 * MineAuth のプラグイン API を叩くための Bearer トークンを取得する。
 *
 * 必ず access token を使う。MineAuth は受け取った JWT の `token_type` クレームが
 * `"token"` であることを確認しており、これを持つのは access token だけなので、
 * id_token を送ると `Token is not valid or has expired` で 401 になる。
 * さらに MineAuth は refresh_token グラントで id_token を再発行しない
 * (OIDC の一般的な作法) ため、ログイン時の id_token は更新されず失効する。
 *
 * access token が失効していても getAccessToken が refresh token で自動更新し、
 * ローテーション後の refresh token も account クッキーへ書き戻される。
 */
async function getPluginApiToken(): Promise<string> {
    const auth = await getAuth();
    const { accessToken } = await auth.api.getAccessToken({
        body: { useAccountCookie: true },
        headers: getRequest().headers,
    });

    if (!accessToken) {
        throw new Error(
            "アクセストークンが見つかりません。再ログインしてください。",
        );
    }

    return accessToken;
}

/**
 * サービスアカウントの Bearer トークンを取得する。
 *
 * `wrangler secret put` で投入する実行時シークレットなので、`wrangler.jsonc` には
 * 現れない。ローカルでは `app/.dev.vars` に置く (`.dev.vars.example` を参照)
 */
function getServiceToken(): string {
    const token = env.MINEAUTH_SERVICE_TOKEN;

    if (!token) {
        throw new Error(
            "MINEAUTH_SERVICE_TOKEN が設定されていません。ローカルでは app/.dev.vars に設定してください。",
        );
    }

    return token;
}

interface PluginApiOptions {
    /** 既定は GET */
    readonly method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    /** JSON として送るリクエストボディ */
    readonly body?: unknown;
    /**
     * 叩き先の Minecraft サーバー。省略するとメインサーバー。
     *
     * 呼び出し側で必ず既知のサーバー名に絞ってから渡すこと。
     * ここへ入る値は URL の一部になるため、自由な文字列を通してはいけない
     */
    readonly server?: ServerName;
    /**
     * 送る Bearer トークンの種類。既定はログイン中ユーザーの access token。
     *
     * `"service"` はサービスアカウントのトークンを使う。MineAuth 側の
     * プレイヤー権限判定を通らないため、ログイン中の Minecraft プレイヤーに
     * 紐づかない管理系の API はこちらで叩く
     */
    readonly auth?: "user" | "service";
}

/**
 * 管理対象の Minecraft サーバー。`wrangler.jsonc` の `SERVERS` と同じ顔ぶれで、
 * 並びは画面に出す順 (ロビー → メイン → 資源)
 */
export const SERVER_NAMES = ["lobby", "main", "res"] as const;

export type ServerName = (typeof SERVER_NAMES)[number];

const isServerName = (value: unknown): value is ServerName =>
    SERVER_NAMES.includes(value as ServerName);

/**
 * 文字列を既知のサーバー名として受け取る。
 * クライアントから来た値をそのまま URL に埋めないための入口
 */
export const parseServerName = (value: unknown): ServerName => {
    if (!isServerName(value)) {
        throw new Error(`不明なサーバーです: ${String(value)}`);
    }
    return value;
};

/**
 * サーバー名から API のベース URL を組み立てる。
 * `SERVER_URL` は末尾に `/` を含むため、そのまま名前を繋げる
 * (`SERVER_URL + "main"` は `MAIN_SERVER_URL` と一致する)
 */
const baseUrlOf = (server: ServerName | undefined): string =>
    server === undefined ? env.MAIN_SERVER_URL : `${env.SERVER_URL}${server}`;

/**
 * プラグイン API が失敗レスポンスを返したことを表すエラー。
 *
 * 呼び出し側が「404 だけは握り潰して既定値で続ける」といった判断をできるよう、
 * 文言だけでなく HTTP のステータスも持たせている
 * (文言から `404` を読み取るような扱い方をしないため)
 */
export class PluginApiError extends Error {
    constructor(
        message: string,
        readonly status: number,
    ) {
        super(message);
        this.name = "PluginApiError";
    }
}

/**
 * Minecraft サーバーのプラグイン API へリクエストして JSON を受け取る。
 *
 * トークンの取得・付与とレスポンスの検査をここに閉じ込め、
 * 各ルートのサーバー関数はパスと戻り値の型だけを与えれば済むようにしている。
 *
 * @param path サーバーのベース URL からの相対パス (例: `/api/v1/plugins/...`)
 * @param resourceLabel 失敗時のメッセージに使う日本語のリソース名 (例: `駅一覧`)
 *
 * 戻り値の型は呼び出し側が指定する。レスポンスの検証はしていないため、
 * `as` によるキャストはこの 1 か所に閉じ込めている。
 */
export async function fetchPluginApi<T>(
    path: string,
    resourceLabel: string,
    options: PluginApiOptions = {},
): Promise<T> {
    const { method = "GET", body, server, auth = "user" } = options;
    const token =
        auth === "service" ? getServiceToken() : await getPluginApiToken();

    const response = await fetch(`${baseUrlOf(server)}${path}`, {
        method,
        headers: {
            Authorization: `Bearer ${token}`,
            ...(body === undefined
                ? {}
                : { "Content-Type": "application/json" }),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
    });

    // 失敗レスポンスのボディをそのまま値として扱うと描画時に落ちて原因が
    // 分かりにくくなる。ここで loader / action の失敗にして呼び出し側へ渡す
    if (!response.ok) {
        throw new PluginApiError(
            `${resourceLabel}に失敗しました (${await describeFailure(response, path)})`,
            response.status,
        );
    }

    return (await response.json()) as T;
}

/**
 * プラグインごとの、失敗したときに案内したいこと。
 *
 * 権限名も「導入されていないときに何が起きるか」もプラグイン次第なので、
 * パスから引けるようにここへまとめておく
 */
interface PluginHint {
    /** 403 のときの案内。何が足りないかはトークンの種類によって変わる */
    readonly forbidden?: string;
    /** 404 のときの案内。導入されていない可能性がある API だけ持つ */
    readonly notInstalled?: string;
}

const PLUGIN_HINTS: Readonly<Record<string, PluginHint>> = {
    // ログイン中ユーザーのトークンで叩くので、足りないのはプレイヤーの権限
    advancerailway: {
        forbidden: "権限が足りません (advancerailway.admin が必要です)",
    },
    // サービストークンで叩くので、403 はプレイヤーではなくトークン側の問題
    mpm: {
        forbidden: "サービストークンにこの API を叩く権限がありません",
        notInstalled: "このサーバーには MPM が導入されていません",
    },
};

/** `/api/v1/plugins/<name>/...` からプラグイン名を取り出す */
const hintOf = (path: string): PluginHint | undefined => {
    const name = path.match(/^\/api\/v1\/plugins\/([^/?]+)/)?.[1];
    return name === undefined ? undefined : PLUGIN_HINTS[name];
};

// プラグイン API は、その操作に対応する権限を持つプレイヤーのユーザートークンだけを
// 通す。しかも権限判定はオンラインのプレイヤーに対して行われるため、オフラインだと
// 403 `player_offline` になる。何を直せばよいか分かる文言に置き換える
const describeFailure = async (
    response: Response,
    path: string,
): Promise<string> => {
    const detail = await response.text().catch(() => "");
    const hint = hintOf(path);

    if (response.status === 403 && detail.includes("player_offline")) {
        return "403: Minecraft サーバーにログインしている間だけ操作できます";
    }
    if (response.status === 403 && hint?.forbidden) {
        return `403: ${hint.forbidden}${detail ? ` / ${detail}` : ""}`;
    }
    // 導入されていないプラグインの API はルーティング自体が無く 404 になる
    if (response.status === 404 && hint?.notInstalled) {
        return `404: ${hint.notInstalled}`;
    }
    return `${response.status}${detail ? `: ${detail}` : ""}`;
};
