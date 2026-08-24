import { createServerFn } from "@tanstack/react-start";
import {
    fetchGroups,
    fetchRailways,
    fetchStations,
} from "../../-api/advance-railway";
import { toRailwayRows } from "../-functions/to-railway-rows";
import type { RailwayListData } from "../-types";

/**
 * 路線一覧を、駅名・グループ名まで解決した状態で取得する。
 *
 * 路線 API は駅とグループを ID でしか返さないため、3 つの一覧を並行して取り、
 * サーバー側で突き合わせてから返す。クライアントからの往復は 1 回で済む。
 */
export const getRailways = createServerFn().handler(
    async (): Promise<RailwayListData> => {
        const [railways, stations, groups] = await Promise.all([
            fetchRailways(),
            fetchStations(),
            fetchGroups(),
        ]);

        return {
            railways: toRailwayRows(
                railways.railways,
                stations.stations,
                groups.groups,
            ),
        };
    },
);
