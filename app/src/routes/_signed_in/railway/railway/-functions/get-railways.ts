import { env } from "cloudflare:workers";
import { createServerFn } from "@tanstack/react-start";
import { getApiToken } from "@/lib/server-functions";
import type { RailwaysResponse } from "../-types";

/**
 * AdvanceRailway の路線一覧を取得するサーバー関数
 */
export const getRailways = createServerFn().handler(async () => {
    const token = await getApiToken();

    const response = await fetch(
        `${env.MAIN_SERVER_URL}/api/v1/plugins/advancerailway/railways`,
        {
            headers: { Authorization: `Bearer ${token}` },
        },
    );

    if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        throw new Error(
            `AdvanceRailway の路線一覧の取得に失敗しました (${response.status}${errorText ? `: ${errorText}` : ""})`,
        );
    }

    return (await response.json()) as RailwaysResponse;
});
