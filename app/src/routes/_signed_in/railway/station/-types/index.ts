/**
 * 3次元座標
 */
export interface Point3D {
    readonly x: number;
    readonly y: number;
    readonly z: number;
}

/**
 * AdvanceRailway の駅情報
 */
export interface StationItem {
    readonly id: string;
    readonly name: string;
    readonly color: string;
    readonly numbering: string | null;
    readonly overrideSize: number | null;
    readonly world: string;
    readonly point: Point3D;
}

/**
 * 駅一覧 API のレスポンス
 */
export interface StationsResponse {
    readonly stations: readonly StationItem[];
}
