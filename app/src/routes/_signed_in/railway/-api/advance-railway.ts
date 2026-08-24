import { fetchPluginApi } from "@/lib/plugin-api";
import type {
    RailwayGroupsResponse,
    RailwaysResponse,
    StationsResponse,
} from "../-types";

// AdvanceRailway プラグイン API の呼び出し。
// サーバー関数はページごとに用意するため、ここは素の関数として置いている

const BASE_PATH = "/api/v1/plugins/advancerailway";

export const fetchGroups = () =>
    fetchPluginApi<RailwayGroupsResponse>(
        `${BASE_PATH}/groups`,
        "鉄道グループ一覧",
    );

export const fetchRailways = () =>
    fetchPluginApi<RailwaysResponse>(`${BASE_PATH}/railways`, "路線一覧");

export const fetchStations = () =>
    fetchPluginApi<StationsResponse>(`${BASE_PATH}/stations`, "駅一覧");
