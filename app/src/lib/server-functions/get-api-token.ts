import { getRequest } from "@tanstack/react-start/server";
import { getAuth } from "../auth";

/**
 * MineAuth プラグイン API 通信用の Bearer トークンを取得する。
 * プラグイン API は JWT (idToken) を要求するため、idToken があれば優先し、
 * なければ accessToken を使用する。
 */
export async function getApiToken(): Promise<string> {
    const auth = await getAuth();
    const tokenResult = await auth.api.getAccessToken({
        body: { useAccountCookie: true },
        headers: getRequest().headers,
    });

    const token = tokenResult.idToken ?? tokenResult.accessToken;
    if (!token) {
        throw new Error(
            "認証トークンが見つかりません。再ログインしてください。",
        );
    }

    return token;
}
