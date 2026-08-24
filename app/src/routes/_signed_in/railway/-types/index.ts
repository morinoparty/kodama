// AdvanceRailway プラグイン API のレスポンス型。
// グループ・路線・駅は互いを ID で参照し合うため、セクション共通でここにまとめる。

/**
 * AdvanceRailway が返す 3 次元座標。駅・路線のどちらでも使う
 */
export interface Point3D {
    readonly x: number;
    readonly y: number;
    readonly z: number;
}

/**
 * 鉄道グループ (路線をまとめる単位)
 */
export interface RailwayGroup {
    readonly id: string;
    readonly name: string;
    /** `#RRGGBB` 形式のカラーコード */
    readonly color: string;
}

/**
 * 駅
 *
 * `numbering` と `overrideSize` は API のスキーマ上 nullable かつ任意なので、
 * 未設定のときは null と undefined のどちらもありうる
 */
export interface StationItem {
    readonly id: string;
    readonly name: string;
    /** `#RRGGBB` 形式のカラーコード */
    readonly color: string;
    /** 駅ナンバリング (例: `AR-01`) */
    readonly numbering?: string | null;
    /** 地図上の表示サイズの上書き値 */
    readonly overrideSize?: number | null;
    readonly world: string;
    readonly point: Point3D;
}

/**
 * 路線 (駅と駅を結ぶ 1 区間)
 *
 * `group` / `fromStation` / `toStation` はいずれも**名前ではなく ID**。
 * 画面に出すときは駅・グループの一覧と突き合わせて名前に直す
 */
export interface RailwayItem {
    readonly id: string;
    readonly lineType: string;
    /** 出発駅の ID */
    readonly fromStation: string;
    /** 到着駅の ID */
    readonly toStation: string;
    /** 所属するグループの ID。未所属なら null */
    readonly group: string | null;
    /** 所要時間 (秒) */
    readonly timeRequired: number;
    readonly world: string;
    readonly startPoint: Point3D;
    readonly endPoint: Point3D;
}

/** `GET /api/v1/plugins/advancerailway/groups` のレスポンス */
export interface RailwayGroupsResponse {
    readonly groups: RailwayGroup[];
}

/** `GET /api/v1/plugins/advancerailway/railways` のレスポンス */
export interface RailwaysResponse {
    readonly railways: RailwayItem[];
}

/** `GET /api/v1/plugins/advancerailway/stations` のレスポンス */
export interface StationsResponse {
    readonly stations: StationItem[];
}
