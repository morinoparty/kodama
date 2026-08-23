import type { Point3D } from "../../-types";

/**
 * AdvanceRailway の路線 (駅と駅を結ぶ 1 区間)
 */
export interface RailwayItem {
    readonly id: string;
    readonly lineType: string;
    readonly fromStation: string;
    readonly toStation: string;
    /** 所属するグループの ID。未所属なら null */
    readonly group: string | null;
    /** 所要時間 (秒) */
    readonly timeRequired: number;
    readonly world: string;
    readonly startPoint: Point3D;
    readonly endPoint: Point3D;
}

/**
 * 路線一覧 API (`GET /api/v1/plugins/advancerailway/railways`) のレスポンス
 */
export interface RailwaysResponse {
    readonly railways: RailwayItem[];
}
