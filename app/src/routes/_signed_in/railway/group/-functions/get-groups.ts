import { env } from "cloudflare:workers";
import { createServerFn } from "@tanstack/react-start";
import { getApiToken } from "@/lib/server-functions";
import type { RailwayGroupsResponse } from "../-types";

/**
 * AdvanceRailway のグループ一覧を取得するサーバー関数
 */
export const getGroups = createServerFn().handler(async () => {
    const token = await getApiToken();

    const response = await fetch(
        `${env.MAIN_SERVER_URL}/api/v1/plugins/advancerailway/groups`,
        {
            headers: { Authorization: `Bearer ${token}` },
        },
    );

    if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        throw new Error(
            `AdvanceRailway のグループ一覧の取得に失敗しました (${response.status}${errorText ? `: ${errorText}` : ""})`,
        );
    }

    return (await response.json()) as RailwayGroupsResponse;
});
