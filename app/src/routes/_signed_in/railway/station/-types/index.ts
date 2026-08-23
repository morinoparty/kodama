import type { Point3D } from "../../-types";

/**
 * AdvanceRailway の駅
 *
 * `numbering` と `overrideSize` は API のスキーマ上 nullable かつ任意なので、
 * 未設定のときは null と undefined のどちらもありうる
 */
export interface StationItem {
    readonly id: string;
    readonly name: string;
    readonly color: string;
    /** 駅ナンバリング (例: `AR-01`) */
    readonly numbering?: string | null;
    /** 地図上の表示サイズの上書き値 */
    readonly overrideSize?: number | null;
    readonly world: string;
    readonly point: Point3D;
}

/**
 * 駅一覧 API (`GET /api/v1/plugins/advancerailway/stations`) のレスポンス
 */
export interface StationsResponse {
    readonly stations: StationItem[];
}
