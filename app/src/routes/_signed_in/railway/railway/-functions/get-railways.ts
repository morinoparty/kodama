import { env } from "cloudflare:workers";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { getAuth } from "@/lib/auth";
import type { RailwaysResponse } from "../-types";

/**
 * AdvanceRailway の路線一覧を取得するサーバー関数
 */
export const getRailways = createServerFn().handler(async () => {
    const auth = await getAuth();
    const tokenResult = await auth.api.getAccessToken({
        body: { useAccountCookie: true },
        headers: getRequest().headers,
    });

    const response = await fetch(
        `${env.MAIN_SERVER_URL}/api/v1/plugins/advancerailway/railways`,
        {
            headers: { Authorization: `Bearer ${tokenResult.accessToken}` },
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
