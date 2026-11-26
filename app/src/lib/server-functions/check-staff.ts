import { createServerFn } from "@tanstack/react-start";
import { hasStaffRole } from "../staff";
import { fetchUserInfo } from "../user-info";

/**
 * ログイン中ユーザーが運営ロールを持っているかを返す。
 *
 * 画面の出し分け (フォームを出すか、権限が無い旨を出すか) にだけ使う。
 * 実際の操作の可否は、各サーバー関数に付けた staffMiddleware がサーバー側で判定する
 */
export const checkStaff = createServerFn().handler(async () => {
    const userInfo = await fetchUserInfo();
    return { isStaff: hasStaffRole(userInfo.roles) };
});
