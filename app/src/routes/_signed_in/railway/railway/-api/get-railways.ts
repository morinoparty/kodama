import { createServerFn } from "@tanstack/react-start";
import {
    fetchGroups,
    fetchRailways,
    fetchStations,
    patchRailwayGroup,
    patchRailwaySlug,
} from "../../-api/advance-railway";
import { toRailwayRows } from "../-functions/to-railway-rows";
import type { RailwayListData } from "../-types";

/**
 * 路線一覧を、駅名・グループ名まで解決した状態で取得する。
 *
 * 路線 API は駅とグループを ID / slug でしか返さないため、3 つの一覧を並行して取り、
 * サーバー側で突き合わせてから返す。クライアントからの往復は 1 回で済む。
 * グループの一覧は、所属を選び直す Select の選択肢としてもそのまま使う。
 */
export const getRailways = createServerFn().handler(
    async (): Promise<RailwayListData> => {
        const [railways, stations, groups] = await Promise.all([
            fetchRailways(),
            fetchStations(),
            fetchGroups(),
        ]);

        return {
            railways: toRailwayRows(railways, stations, groups),
            groups,
        };
    },
);

/** 路線の slug を変更する */
export const updateRailwaySlug = createServerFn({ method: "POST" })
    .inputValidator((input: { id: string; slug: string }) => input)
    .handler(({ data }) => patchRailwaySlug(data.id, data.slug));

/** 路線の所属グループを変更する。null で未所属に戻す */
export const updateRailwayGroup = createServerFn({ method: "POST" })
    .inputValidator((input: { id: string; groupId: string | null }) => input)
    .handler(({ data }) => patchRailwayGroup(data.id, data.groupId));
