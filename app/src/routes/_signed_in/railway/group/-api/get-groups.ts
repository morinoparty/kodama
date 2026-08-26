import { createServerFn } from "@tanstack/react-start";
import {
    fetchGroups,
    patchGroupName,
    patchGroupNumberingPrefix,
    patchGroupNumberingStart,
    patchGroupSlug,
} from "../../-api/advance-railway";

/**
 * AdvanceRailway のグループ一覧を取得する。
 * アクセストークンをクライアントに渡さないため、通信はサーバー側で行う。
 */
export const getGroups = createServerFn().handler(async () => ({
    groups: await fetchGroups(),
}));

/** グループの slug を変更する */
export const updateGroupSlug = createServerFn({ method: "POST" })
    .inputValidator((input: { id: string; slug: string }) => input)
    .handler(({ data }) => patchGroupSlug(data.id, data.slug));

/** グループの名前を変更する */
export const updateGroupName = createServerFn({ method: "POST" })
    .inputValidator((input: { id: string; name: string }) => input)
    .handler(({ data }) => patchGroupName(data.id, data.name));

/**
 * グループのナンバリング接頭辞を変更する。
 * `prefix` が null なら未設定に戻す
 */
export const updateGroupNumberingPrefix = createServerFn({ method: "POST" })
    .inputValidator((input: { id: string; prefix: string | null }) => input)
    .handler(({ data }) => patchGroupNumberingPrefix(data.id, data.prefix));

/** グループのナンバリング開始番号を変更する */
export const updateGroupNumberingStart = createServerFn({ method: "POST" })
    .inputValidator((input: { id: string; start: number }) => input)
    .handler(({ data }) => patchGroupNumberingStart(data.id, data.start));
