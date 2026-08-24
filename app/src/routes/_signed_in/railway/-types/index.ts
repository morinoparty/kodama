// AdvanceRailway プラグイン API のレスポンス型。
// グループ・路線・駅は互いを ID で参照し合うため、セクション共通でここにまとめる。
//
// `id` は UUID、`slug` は人が読める識別子。API のパスはどちらでも受け付けるが、
// 更新時は必ず UUID で指定する (slug 自体を書き換えるため)。

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
    readonly slug: string;
    readonly name: string;
    /** `#RRGGBB` 形式のカラーコード */
    readonly color: string;
    /** 駅ナンバリングの接頭辞 (例: `AR`) */
    readonly numberingPrefix?: string | null;
    /** 駅ナンバリングの開始番号 */
    readonly numberingStart: number;
}

/**
 * 駅が所属するグループごとのナンバリング。
 * 1 つの駅が複数のグループに属しうるため配列で返る
 */
export interface StationNumbering {
    /** グループの UUID */
    readonly group: string;
    readonly groupName: string;
    readonly groupSlug: string;
    /** 採番された駅番号 (例: `AR-01`)。未採番なら null */
    readonly numbering?: string | null;
    /** グループ内での並び順 */
    readonly position: number;
}

/**
 * 駅
 */
export interface StationItem {
    readonly id: string;
    readonly slug: string;
    readonly name: string;
    /** `#RRGGBB` 形式のカラーコード */
    readonly color: string;
    readonly numberings: StationNumbering[];
    /** 地図上の表示サイズの上書き値 */
    readonly overrideSize?: number | null;
    readonly world: string;
    readonly point: Point3D;
}

/**
 * 路線 (駅と駅を結ぶ 1 区間)
 *
 * `group` / `fromStation` / `toStation` は UUID。`*Slug` は同じ対象の slug で、
 * 名前は含まれないため、表示名は駅・グループの一覧と突き合わせて解決する
 */
export interface RailwayItem {
    readonly id: string;
    readonly slug: string;
    readonly lineType: string;
    /** 運行に関するフラグ (プラグイン側の内部表現) */
    readonly flags: string;
    /** 出発駅の UUID */
    readonly fromStation: string;
    readonly fromStationSlug?: string | null;
    /** 到着駅の UUID */
    readonly toStation: string;
    readonly toStationSlug?: string | null;
    /** 所属するグループの UUID。未所属なら null */
    readonly group: string | null;
    readonly groupSlug?: string | null;
    /** 所要時間 (秒) */
    readonly timeRequired: number;
    readonly world: string;
    readonly startPoint: Point3D;
    readonly endPoint: Point3D;
    /** 最後に点検した日時 (ISO 8601)。未点検なら null */
    readonly lastCheckedAt?: string | null;
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
