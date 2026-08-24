import { createServerFn } from "@tanstack/react-start";
import { fetchGroups } from "../../-api/advance-railway";

/**
 * AdvanceRailway のグループ一覧を取得する。
 * アクセストークンをクライアントに渡さないため、通信はサーバー側で行う。
 */
export const getGroups = createServerFn().handler(() => fetchGroups());
