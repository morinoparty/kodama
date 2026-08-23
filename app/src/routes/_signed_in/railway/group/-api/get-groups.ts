import { createServerFn } from "@tanstack/react-start";
import { fetchPluginApi } from "@/lib/plugin-api";
import type { RailwayGroupsResponse } from "../-types";

/**
 * AdvanceRailway のグループ一覧を取得する。
 * アクセストークンをクライアントに渡さないため、通信はサーバー側で行う。
 */
export const getGroups = createServerFn().handler(() =>
    fetchPluginApi<RailwayGroupsResponse>(
        "/api/v1/plugins/advancerailway/groups",
        "鉄道グループ一覧",
    ),
);
