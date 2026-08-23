import { createServerFn } from "@tanstack/react-start";
import { fetchPluginApi } from "@/lib/plugin-api";
import type { StationsResponse } from "../-types";

/**
 * AdvanceRailway の駅一覧を取得する。
 * アクセストークンをクライアントに渡さないため、通信はサーバー側で行う。
 */
export const getStations = createServerFn().handler(() =>
    fetchPluginApi<StationsResponse>(
        "/api/v1/plugins/advancerailway/stations",
        "駅一覧",
    ),
);
