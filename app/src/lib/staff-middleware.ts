import { createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { getAuth } from "./auth";
import { hasStaffRole, STAFF_ROLE } from "./staff";
import { fetchUserInfo } from "./user-info";

/**
 * サーバー関数を運営メンバー (MineAuth の `staff` ロール) だけに絞るミドルウェア。
 *
 * `_signed_in` の `server.middleware` (authMiddleware) はページのリクエストにしか効かず、
 * サーバー関数の RPC は素通りする。既存のサーバー関数はログイン中ユーザー自身の
 * トークンを転送するだけなので問題にならないが、`MC_API_ASSIGN_TOKEN` のような
 * 共有の secret を使うサーバー関数は、ここでセッションとロールを確かめてから動かす。
 *
 * ロールはクライアントの申告ではなく、毎回 MineAuth の userinfo から引き直す
 * (セッションに残ったログイン時点のロールより新しい値で判定できる)
 */
export const staffMiddleware = createMiddleware({ type: "function" }).server(
    async ({ next }) => {
        const auth = await getAuth();
        const session = await auth.api.getSession({
            headers: getRequest().headers,
        });
        if (!session) {
            throw new Error("ログインが必要です。再ログインしてください。");
        }

        const userInfo = await fetchUserInfo();
        if (!hasStaffRole(userInfo.roles)) {
            throw new Error(
                `この操作には MineAuth の ${STAFF_ROLE} ロールが必要です。`,
            );
        }

        return next();
    },
);
