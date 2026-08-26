import { fetchPluginApi } from "@/lib/plugin-api";
import type {
    GroupStation,
    RailwayGroup,
    RailwayGroupsResponse,
    RailwayItem,
    RailwaysResponse,
    StationItem,
    StationNumbering,
} from "../-types";

// AdvanceRailway プラグイン API の呼び出し。
// サーバー関数はページごとに用意するため、ここは素の関数として置いている

const BASE_PATH = "/api/v1/plugins/advancerailway";

// 一覧 API は limit を省くと 100 件で打ち切られる。上限の 500 件ずつ、
// 返ってきた件数が limit に満たなくなるまで辿って全件を集める
const PAGE_SIZE = 500;

/**
 * offset をずらしながら一覧 API を最後まで辿る。
 *
 * @param path 一覧のパス
 * @param resourceLabel 失敗時のメッセージに使うリソース名
 * @param pick レスポンスから配列を取り出す関数
 */
async function fetchAllPages<TResponse, TItem>(
    path: string,
    resourceLabel: string,
    pick: (response: TResponse) => TItem[] | undefined,
): Promise<TItem[]> {
    const items: TItem[] = [];

    for (let offset = 0; ; offset += PAGE_SIZE) {
        // 配列が丸ごと欠けていても落ちないようにしておく
        const page =
            pick(
                await fetchPluginApi<TResponse>(
                    `${path}?limit=${PAGE_SIZE}&offset=${offset}`,
                    `${resourceLabel}の取得`,
                ),
            ) ?? [];
        items.push(...page);

        // 満たないページが来たらそこが最後
        if (page.length < PAGE_SIZE) {
            return items;
        }
    }
}

export const fetchGroups = () =>
    fetchAllPages<RailwayGroupsResponse, RailwayGroup>(
        `${BASE_PATH}/groups`,
        "鉄道グループ一覧",
        (response) => response.groups,
    );

export const fetchRailways = () =>
    fetchAllPages<RailwaysResponse, RailwayItem>(
        `${BASE_PATH}/railways`,
        "路線一覧",
        (response) => response.railways,
    );

// numberings は Kotlin 側の DTO が `= emptyList()` の既定値を持つため、
// どのグループにも属していない駅ではレスポンスから項目ごと省かれることがある。
// OpenAPI は required と書いているが実際には来ないので、境界でここだけ整えておく
type RawStation = Omit<StationItem, "numberings"> & {
    numberings?: StationNumbering[];
};

interface RawStationsResponse {
    readonly stations: RawStation[];
}

const normalizeStation = (station: RawStation): StationItem => ({
    ...station,
    numberings: station.numberings ?? [],
});

export const fetchStations = async (): Promise<StationItem[]> => {
    const stations = await fetchAllPages<RawStationsResponse, RawStation>(
        `${BASE_PATH}/stations`,
        "駅一覧",
        (response) => response.stations,
    );

    return stations.map(normalizeStation);
};

/** 駅を 1 件取得する。存在しなければ API が 404 を返す */
export const fetchStation = async (id: string): Promise<StationItem> =>
    normalizeStation(
        await fetchPluginApi<RawStation>(
            `${BASE_PATH}/stations/${id}`,
            "駅の取得",
        ),
    );

/** グループを 1 件取得する。存在しなければ API が 404 を返す */
export const fetchGroup = (id: string) =>
    fetchPluginApi<RailwayGroup>(
        `${BASE_PATH}/groups/${id}`,
        "鉄道グループの取得",
    );

// `GET`/`PUT` /groups/{id}/stations のレスポンス。入れ子の駅も
// `numberings` が省かれることがあるため、一覧と同じように整えて返す
interface RawGroupStationsResponse {
    readonly stations: (Omit<GroupStation, "station"> & {
        station: RawStation;
    })[];
}

const toGroupStations = (response: RawGroupStationsResponse): GroupStation[] =>
    (response.stations ?? []).map((entry) => ({
        ...entry,
        station: normalizeStation(entry.station),
    }));

/**
 * グループに属する駅を並び順で取得する。
 * この API はページングを持たず、常に全件を並び順で返す
 */
export const fetchGroupStations = async (
    groupId: string,
): Promise<GroupStation[]> =>
    toGroupStations(
        await fetchPluginApi<RawGroupStationsResponse>(
            `${BASE_PATH}/groups/${groupId}/stations`,
            "グループ内の駅の並びの取得",
        ),
    );

/**
 * グループに属する駅の並びを、渡した順序でまるごと置き換える。
 *
 * 1 件ずつの移動ではなく一括置換なのは API 側の仕様。配列の並びがそのまま
 * `position` の 0, 1, 2 … になり、同じ入力を 2 回送っても結果が変わらない。
 * 更新は必ず UUID で指定する (slug も受け付けるが、slug は書き換わりうるため)。
 *
 * 置き換え後の並びが返るので、そのまま新しい状態として使える。
 */
export const putGroupStations = async (
    groupId: string,
    stationIds: readonly string[],
): Promise<GroupStation[]> =>
    toGroupStations(
        await fetchPluginApi<RawGroupStationsResponse>(
            `${BASE_PATH}/groups/${groupId}/stations`,
            "駅の並びの変更",
            { method: "PUT", body: { stations: stationIds } },
        ),
    );

/**
 * PATCH のリクエストボディ。
 *
 * 値を渡した項目だけが書き換わり、`unset` に並べた項目名は未設定に戻る。
 * `unset` はスキーマ上必須なので、空でも必ず送る。
 */
type PatchBody = Record<string, unknown> & { unset: string[] };

const patch = <T>(
    resource: "groups" | "railways" | "stations",
    id: string,
    body: PatchBody,
    resourceLabel: string,
) =>
    // パスは UUID でも slug でも通るが、slug 自体を書き換えることがあるため
    // 常に UUID で指定する
    fetchPluginApi<T>(`${BASE_PATH}/${resource}/${id}`, resourceLabel, {
        method: "PATCH",
        body,
    });

/** グループの slug を変更する */
export const patchGroupSlug = (id: string, slug: string) =>
    patch<RailwayGroup>(
        "groups",
        id,
        { slug, unset: [] },
        "グループの slug の変更",
    );

/** グループの名前を変更する */
export const patchGroupName = (id: string, name: string) =>
    patch<RailwayGroup>("groups", id, { name, unset: [] }, "グループ名の変更");

/**
 * グループのナンバリング接頭辞を変更する。
 * `prefix` に null を渡すとナンバリングなしに戻る (値の削除は `unset` で指定する)
 */
export const patchGroupNumberingPrefix = (id: string, prefix: string | null) =>
    patch<RailwayGroup>(
        "groups",
        id,
        prefix === null
            ? { unset: ["numberingPrefix"] }
            : { numberingPrefix: prefix, unset: [] },
        "ナンバリング接頭辞の変更",
    );

/**
 * グループのナンバリング開始番号を変更する。
 * 接頭辞と違い `unset` に対応しないため、既定へ戻したいときは 1 を送る
 */
export const patchGroupNumberingStart = (id: string, start: number) =>
    patch<RailwayGroup>(
        "groups",
        id,
        { numberingStart: start, unset: [] },
        "ナンバリング開始番号の変更",
    );

/** 駅の slug を変更する */
export const patchStationSlug = (id: string, slug: string) =>
    patch<StationItem>("stations", id, { slug, unset: [] }, "駅の slug の変更");

/** 駅の名前を変更する */
export const patchStationName = (id: string, name: string) =>
    patch<StationItem>("stations", id, { name, unset: [] }, "駅名の変更");

/** 路線の slug を変更する */
export const patchRailwaySlug = (id: string, slug: string) =>
    patch<RailwayItem>(
        "railways",
        id,
        { slug, unset: [] },
        "路線の slug の変更",
    );

/**
 * 路線の所属グループを変更する。
 * `groupId` に null を渡すと未所属に戻す (値の削除は `unset` で指定する)
 */
export const patchRailwayGroup = (id: string, groupId: string | null) =>
    patch<RailwayItem>(
        "railways",
        id,
        groupId === null ? { unset: ["group"] } : { group: groupId, unset: [] },
        "路線のグループの変更",
    );
