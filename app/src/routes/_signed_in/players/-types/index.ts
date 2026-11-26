// mc-api (`/v1/players`) の書き込み系 API の応答と、画面に出す登録結果の型。
// 応答の形は mc-api の src/schemas/players.ts に合わせている

/** `PUT /v1/players/{uuid}` の status */
export type McApiPutStatus =
    | "registered"
    | "updated"
    | "already_registered"
    | "pending";

/** `PUT /v1/players/{uuid}` の応答 */
export interface McApiPutPlayerResponse {
    readonly uuid: string; // 小文字・ハイフンありに正規化された UUID
    readonly status: McApiPutStatus;
    readonly name: string | null; // 分かっている名前。まだ取得していなければ null
}

/** `POST /v1/players/batch` の 1 件ごとの status */
export type McApiBatchStatus =
    | "registered"
    | "already_registered"
    | "pending"
    | "not_found";

/** `POST /v1/players/batch` の応答 (送った uuids と同じ順) */
export interface McApiBatchResponse {
    readonly results: readonly {
        readonly uuid: string;
        readonly status: McApiBatchStatus;
    }[];
}

/**
 * 画面に出す登録結果の status。
 * mc-api の status に加えて、リクエスト自体が失敗したことを表す `error` を持つ
 */
export type RegisterStatus = McApiPutStatus | McApiBatchStatus | "error";

/** 画面に 1 行ずつ出す登録結果 */
export interface RegisterResult {
    readonly uuid: string;
    readonly status: RegisterStatus;
    /** 一括登録の応答には名前が含まれないため、その場合は null */
    readonly name: string | null;
    /** `error` のときの原因 */
    readonly message?: string;
}
