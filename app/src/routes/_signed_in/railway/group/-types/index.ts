/**
 * AdvanceRailway の鉄道グループ (路線をまとめる単位)
 */
export interface RailwayGroup {
    readonly id: string;
    readonly name: string;
    readonly color: string;
}

/**
 * グループ一覧 API (`GET /api/v1/plugins/advancerailway/groups`) のレスポンス
 */
export interface RailwayGroupsResponse {
    readonly groups: RailwayGroup[];
}
