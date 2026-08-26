import { createServerFn } from "@tanstack/react-start";
import {
    fetchGroup,
    fetchGroupStations,
    putGroupStations,
} from "../../-api/advance-railway";

/**
 * グループ 1 件と、そのグループに属する駅の並びを取得する。
 * アクセストークンをクライアントに渡さないため、通信はサーバー側で行う。
 */
export const getGroupDetail = createServerFn()
    .inputValidator((input: { id: string }) => input)
    .handler(async ({ data }) => {
        // 見出しと駅の並びは別々の API なので、まとめて待つ
        const [group, stations] = await Promise.all([
            fetchGroup(data.id),
            fetchGroupStations(data.id),
        ]);
        return { group, stations };
    });

/**
 * グループ内の駅の並びを、渡した順序でまるごと置き換える。
 * 並びがそのまま駅ナンバリングになるため、置き換え後の並びを返す。
 */
export const reorderGroupStations = createServerFn({ method: "POST" })
    .inputValidator((input: { id: string; stationIds: string[] }) => input)
    .handler(({ data }) => putGroupStations(data.id, data.stationIds));
