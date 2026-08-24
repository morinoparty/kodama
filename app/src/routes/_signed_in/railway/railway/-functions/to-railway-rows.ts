import type { RailwayGroup, RailwayItem, StationItem } from "../../-types";
import type { RailwayRow } from "../-types";

/** id -> name の対応表を作る */
const nameById = (items: readonly { id: string; name: string }[]) =>
    new Map(items.map((item) => [item.id, item.name]));

/**
 * 路線が ID で参照している駅・グループを名前へ解決する。
 *
 * 見つからなかった ID は名前の代わりにそのまま残す。データの不整合を
 * 空欄で隠すより、ID が見えていた方が原因を追える。
 */
export function toRailwayRows(
    railways: readonly RailwayItem[],
    stations: readonly StationItem[],
    groups: readonly RailwayGroup[],
): RailwayRow[] {
    const stationNames = nameById(stations);
    const groupNames = nameById(groups);

    return railways.map((railway) => ({
        ...railway,
        fromStationName:
            stationNames.get(railway.fromStation) ?? railway.fromStation,
        toStationName: stationNames.get(railway.toStation) ?? railway.toStation,
        groupName:
            railway.group === null
                ? null
                : (groupNames.get(railway.group) ?? railway.group),
    }));
}
