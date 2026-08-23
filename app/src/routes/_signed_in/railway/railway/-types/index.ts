/**
 * 3次元座標
 */
export interface Point3D {
    readonly x: number;
    readonly y: number;
    readonly z: number;
}

/**
 * AdvanceRailway の路線情報
 */
export interface RailwayItem {
    readonly id: string;
    readonly lineType: string;
    readonly fromStation: string;
    readonly toStation: string;
    readonly group: string | null;
    readonly timeRequired: number;
    readonly world: string;
    readonly startPoint: Point3D;
    readonly endPoint: Point3D;
}

/**
 * 路線一覧 API のレスポンス
 */
export interface RailwaysResponse {
    readonly railways: readonly RailwayItem[];
}
