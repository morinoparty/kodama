import type { RailwayGroup, RailwayItem, StationItem } from "../../-types";
import type { RailwayRow } from "../-types";

/** UUID -> name の対応表を作る */
const nameById = (items: readonly { id: string; name: string }[]) =>
    new Map(items.map((item) => [item.id, item.name]));

/**
 * 路線が ID で参照している駅・グループを名前へ解決する。
 *
 * 名前が引けなかったときは slug、それも無ければ ID をそのまま残す。
 * データの不整合を空欄で隠すより、識別子が見えていた方が原因を追える。
 */
export function toRailwayRows(
    railways: readonly RailwayItem[],
    stations: readonly StationItem[],
    groups: readonly RailwayGroup[],
): RailwayRow[] {
    const stationNames = nameById(stations);
    const groupNames = nameById(groups);

    const resolve = (
        map: Map<string, string>,
        id: string,
        slug: string | null | undefined,
    ) => map.get(id) ?? slug ?? id;

    return railways.map((railway) => ({
        ...railway,
        fromStationName: resolve(
            stationNames,
            railway.fromStation,
            railway.fromStationSlug,
        ),
        toStationName: resolve(
            stationNames,
            railway.toStation,
            railway.toStationSlug,
        ),
        groupName:
            railway.group === null
                ? null
                : resolve(groupNames, railway.group, railway.groupSlug),
    }));
}
