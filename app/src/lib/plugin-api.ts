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

interface PluginApiOptions {
    /** 既定は GET */
    readonly method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    /** JSON として送るリクエストボディ */
    readonly body?: unknown;
}

/**
 * メインサーバーのプラグイン API へリクエストして JSON を受け取る。
 *
 * トークンの取得・付与とレスポンスの検査をここに閉じ込め、
 * 各ルートのサーバー関数はパスと戻り値の型だけを与えれば済むようにしている。
 *
 * @param path `MAIN_SERVER_URL` からの相対パス (例: `/api/v1/plugins/...`)
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
    const token = await getPluginApiToken();
    const { method = "GET", body } = options;

    const response = await fetch(`${env.MAIN_SERVER_URL}${path}`, {
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
        throw new Error(
            `${resourceLabel}に失敗しました (${await describeFailure(response)})`,
        );
    }

    return (await response.json()) as T;
}

// AdvanceRailway の API は `advancerailway.admin` を持つプレイヤーの
// ユーザートークンだけを通し、しかも権限判定はオンラインのプレイヤーに対して
// 行われる。オフラインだと 403 `player_offline` になるので、
// 何を直せばよいか分かる文言に置き換える
const describeFailure = async (response: Response): Promise<string> => {
    const detail = await response.text().catch(() => "");

    if (response.status === 403 && detail.includes("player_offline")) {
        return "403: Minecraft サーバーにログインしている間だけ操作できます";
    }
    if (response.status === 403) {
        return `403: 権限が足りません (advancerailway.admin が必要です)${detail ? ` / ${detail}` : ""}`;
    }
    return `${response.status}${detail ? `: ${detail}` : ""}`;
};
