import { z } from "zod";

/** 一括登録で 1 回に送れる UUID の最大数 (mc-api の MAX_BATCH_UUIDS と同じ) */
export const MAX_BATCH_UUIDS = 100;

// mc-api の UUID_PATTERN と同じく、ハイフンの有無と大文字小文字は問わない
const UUID_PATTERN =
    /^(?:[0-9a-f]{32}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i;

/**
 * UUID を小文字・ハイフンありの形にそろえる。
 * 形の検証は済んでいる前提 (uuidSchema の transform からだけ呼ぶ)
 */
const normalizeUuid = (value: string): string => {
    const hex = value.replaceAll("-", "").toLowerCase();
    return [
        hex.slice(0, 8),
        hex.slice(8, 12),
        hex.slice(12, 16),
        hex.slice(16, 20),
        hex.slice(20),
    ].join("-");
};

/**
 * 入力として受け付ける UUID。前後の空白を落としてから検証し、正規化した値を返す。
 * 正規化した値は mc-api の URL のパスに埋め込むため、ここを通ったものだけを使うこと
 */
export const uuidSchema = z
    .string()
    .trim()
    .regex(UUID_PATTERN, { message: "UUID の形式ではありません" })
    .transform(normalizeUuid);

/** 1 人の登録 (`PUT /v1/players/{uuid}`) の入力 */
export const registerOneInputSchema = z.object({ uuid: uuidSchema });

export type RegisterOneInput = z.input<typeof registerOneInputSchema>;

/** 一括登録 (`POST /v1/players/batch`) の入力 */
export const registerBatchInputSchema = z.object({
    uuids: z
        .array(uuidSchema)
        .min(1, { message: "UUID を 1 件以上入力してください" })
        .max(MAX_BATCH_UUIDS, {
            message: `一度に登録できるのは ${MAX_BATCH_UUIDS} 件までです`,
        }),
    /** true なら新しく登録するもののうち先頭 10 件はその場で上流から取得する */
    fetch: z.boolean(),
});

export type RegisterBatchInput = z.input<typeof registerBatchInputSchema>;

/** 一括入力のテキストを解析した結果 */
export interface ParsedBatchText {
    /** 正規化済みの UUID (入力の順) */
    readonly uuids: string[];
    /** UUID として読めなかった入力 (入力の順) */
    readonly invalid: string[];
}

/**
 * 一括入力のテキストを UUID の一覧に分ける。
 * 改行・カンマ・空白のどれで区切ってもよく、空の行は無視する。
 * 重複はそのまま送る (mc-api 側で already_registered になる)
 */
export const parseBatchText = (text: string): ParsedBatchText => {
    const uuids: string[] = [];
    const invalid: string[] = [];

    for (const token of text.split(/[\s,]+/)) {
        if (token === "") {
            continue;
        }
        const result = uuidSchema.safeParse(token);
        if (result.success) {
            uuids.push(result.data);
        } else {
            invalid.push(token);
        }
    }

    return { uuids, invalid };
};
