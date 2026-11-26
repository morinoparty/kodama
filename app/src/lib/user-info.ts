import { env } from "cloudflare:workers";
import { getRequest } from "@tanstack/react-start/server";
import type { UserInfoData } from "../routes/_signed_in/-types/user-info";
import { getAuth } from "./auth";

/**
 * MineAuth の `/oauth2/userinfo` からログイン中ユーザーの情報を取得する。
 * サーバー側 (サーバー関数・ミドルウェア) からのみ呼び出せる。
 *
 * access token が失効していても getAccessToken が refresh token で自動更新する
 */
export async function fetchUserInfo(): Promise<UserInfoData> {
    const auth = await getAuth();
    const tokenResult = await auth.api.getAccessToken({
        body: { useAccountCookie: true },
        headers: getRequest().headers,
    });

    const response = await fetch(`${env.MAIN_SERVER_URL}/oauth2/userinfo`, {
        headers: { Authorization: `Bearer ${tokenResult.accessToken}` },
    });

    // 失敗レスポンスのボディをそのままユーザー情報として扱うと、
    // 描画時に落ちて原因が分かりにくくなる。ここで呼び出し側の失敗にする
    if (!response.ok) {
        throw new Error(
            `MineAuth の userinfo の取得に失敗しました (${response.status})`,
        );
    }

    return (await response.json()) as UserInfoData;
}
