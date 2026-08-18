import { env } from "cloudflare:workers";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { getAuth } from "../../../../lib/auth";
import type { UserInfoData } from "../-types/user-info";

// MineAuth の access token を使ってログイン中ユーザーの情報を取得する。
// access token が失効していても getAccessToken が refresh token で自動更新する
export const getUserInfo = createServerFn().handler(async () => {
    const auth = await getAuth();
    const tokenResult = await auth.api.getAccessToken({
        body: { useAccountCookie: true },
        headers: getRequest().headers,
    });

    const response = await fetch(`${env.MAIN_SERVER_URL}/oauth2/userinfo`, {
        headers: { Authorization: `Bearer ${tokenResult.accessToken}` },
    });
    return (await response.json()) as UserInfoData;
});

export type UserInfoResponse = Awaited<ReturnType<typeof getUserInfo>>;
