import { createServerFn } from "@tanstack/react-start";
import { fetchStations } from "../../-api/advance-railway";

/**
 * AdvanceRailway の駅一覧を取得する。
 * アクセストークンをクライアントに渡さないため、通信はサーバー側で行う。
 */
export const getStations = createServerFn().handler(() => fetchStations());
