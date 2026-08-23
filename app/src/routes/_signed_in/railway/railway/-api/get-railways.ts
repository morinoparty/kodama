import { createServerFn } from "@tanstack/react-start";
import { fetchPluginApi } from "@/lib/plugin-api";
import type { RailwaysResponse } from "../-types";

/**
 * AdvanceRailway の路線一覧を取得する。
 * アクセストークンをクライアントに渡さないため、通信はサーバー側で行う。
 */
export const getRailways = createServerFn().handler(() =>
    fetchPluginApi<RailwaysResponse>(
        "/api/v1/plugins/advancerailway/railways",
        "路線一覧",
    ),
);
