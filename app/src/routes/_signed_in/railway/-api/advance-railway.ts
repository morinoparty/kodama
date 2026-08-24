import { fetchPluginApi } from "@/lib/plugin-api";
import type {
    RailwayGroup,
    RailwayGroupsResponse,
    RailwayItem,
    RailwaysResponse,
    StationItem,
    StationsResponse,
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
    pick: (response: TResponse) => TItem[],
): Promise<TItem[]> {
    const items: TItem[] = [];

    for (let offset = 0; ; offset += PAGE_SIZE) {
        const page = pick(
            await fetchPluginApi<TResponse>(
                `${path}?limit=${PAGE_SIZE}&offset=${offset}`,
                `${resourceLabel}の取得`,
            ),
        );
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

export const fetchStations = () =>
    fetchAllPages<StationsResponse, StationItem>(
        `${BASE_PATH}/stations`,
        "駅一覧",
        (response) => response.stations,
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

/** 駅の slug を変更する */
export const patchStationSlug = (id: string, slug: string) =>
    patch<StationItem>("stations", id, { slug, unset: [] }, "駅の slug の変更");

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
