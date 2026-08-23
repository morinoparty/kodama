/**
 * AdvanceRailway の鉄道グループ情報
 */
export interface RailwayGroup {
    readonly id: string;
    readonly name: string;
    readonly color: string;
}

/**
 * グループ一覧 API のレスポンス
 */
export interface RailwayGroupsResponse {
    readonly groups: readonly RailwayGroup[];
}
