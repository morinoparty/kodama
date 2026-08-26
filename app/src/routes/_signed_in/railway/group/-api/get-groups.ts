import { createServerFn } from "@tanstack/react-start";
import {
    fetchGroups,
    patchGroupName,
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
