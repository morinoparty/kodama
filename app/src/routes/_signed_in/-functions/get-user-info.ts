import { createServerFn } from "@tanstack/react-start";
import { fetchUserInfo } from "../../../lib/user-info";

// MineAuth の access token を使ってログイン中ユーザーの情報を取得する。
// 取得処理そのものは staffMiddleware とも共有するため lib/user-info.ts に置いている
export const getUserInfo = createServerFn().handler(() => fetchUserInfo());

export type UserInfoResponse = Awaited<ReturnType<typeof getUserInfo>>;
