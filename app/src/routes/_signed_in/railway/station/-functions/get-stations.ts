import { env } from "cloudflare:workers";
import { createServerFn } from "@tanstack/react-start";
import { getApiToken } from "@/lib/server-functions";
import type { StationsResponse } from "../-types";

/**
 * AdvanceRailway の駅一覧を取得するサーバー関数
 */
export const getStations = createServerFn().handler(async () => {
    const token = await getApiToken();

    const response = await fetch(
        `${env.MAIN_SERVER_URL}/api/v1/plugins/advancerailway/stations`,
        {
            headers: { Authorization: `Bearer ${token}` },
        },
    );

    if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        throw new Error(
            `AdvanceRailway の駅一覧の取得に失敗しました (${response.status}${errorText ? `: ${errorText}` : ""})`,
        );
    }

    return (await response.json()) as StationsResponse;
});
