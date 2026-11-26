import { env } from "cloudflare:workers";
import type { McApiBatchResponse, McApiPutPlayerResponse } from "../-types";

/**
 * mc-api が失敗レスポンスを返したことを表すエラー。
 * 呼び出し側が「PUT の 404 は Mojang に存在しない UUID」と判断できるよう、
 * 文言だけでなく HTTP のステータスも持たせている
 */
export class McApiError extends Error {
    constructor(
        message: string,
        readonly status: number,
    ) {
        super(message);
        this.name = "McApiError";
    }
}

/**
 * mc-api の書き込み用トークンを取得する。
 *
 * Worker secret (cloudflare.config.ts の `bindings.secret()`)。本番へは Deploy ワークフローが
 * `cf deploy --secrets-file` で投入する。ローカルでは `app/.env` に置く (`.env.example` を参照)
 */
function getAssignToken(): string {
    const token = env.MC_API_ASSIGN_TOKEN;

    if (!token) {
        throw new Error(
            "MC_API_ASSIGN_TOKEN が設定されていません。ローカルでは app/.env に設定してください。",
        );
    }

    return token;
}

/**
 * mc-api のエラー応答 (`{ "error": "..." }`) から、人が読むための説明を取り出す。
 * JSON でなければ本文をそのまま使う
 */
const describeFailure = async (response: Response): Promise<string> => {
    const text = await response.text().catch(() => "");
    try {
        const body = JSON.parse(text) as { error?: unknown };
        if (typeof body.error === "string") {
            return `${response.status}: ${body.error}`;
        }
    } catch {
        // JSON でなければ下で本文をそのまま返す
    }
    return `${response.status}${text ? `: ${text}` : ""}`;
};

/**
 * mc-api の書き込み系 API へリクエストして JSON を受け取る。
 *
 * mc-api の書き込み系はサーバー間専用 (CORS なし) で、Bearer トークンを要求する。
 * トークンをクライアントに渡さないため、必ずサーバー関数の中から呼ぶこと。
 *
 * 戻り値の型は呼び出し側が指定する。レスポンスの検証はしていないため、
 * `as` によるキャストはこの 1 か所に閉じ込めている。
 */
async function requestMcApi<T>(
    path: string,
    method: "PUT" | "POST",
    body?: unknown,
): Promise<T> {
    const response = await fetch(`${env.MC_API_URL}${path}`, {
        method,
        headers: {
            Authorization: `Bearer ${getAssignToken()}`,
            ...(body === undefined
                ? {}
                : { "Content-Type": "application/json" }),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
    });

    if (!response.ok) {
        throw new McApiError(
            `mc-api への登録に失敗しました (${await describeFailure(response)})`,
            response.status,
        );
    }

    return (await response.json()) as T;
}

/**
 * 1 人を登録・更新する (`PUT /v1/players/{uuid}`)。
 *
 * ボディの `name` は送らない。mc-api はこの値を信用して名前のインデックスに書くため、
 * 運営が手入力した名前で上書きしないよう、名前は上流 (Mojang) から取得させる。
 *
 * @param uuid 正規化済みの UUID (uuidSchema を通したもの)。URL のパスに埋め込む
 */
export const putPlayer = (uuid: string): Promise<McApiPutPlayerResponse> =>
    requestMcApi<McApiPutPlayerResponse>(
        `/v1/players/${encodeURIComponent(uuid)}`,
        "PUT",
    );

/** まとめて登録する (`POST /v1/players/batch`、最大 100 件) */
export const postPlayersBatch = (
    uuids: readonly string[],
    fetchProfiles: boolean,
): Promise<McApiBatchResponse> =>
    requestMcApi<McApiBatchResponse>("/v1/players/batch", "POST", {
        uuids,
        fetch: fetchProfiles,
    });
