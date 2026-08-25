import { Badge } from "@morinoparty/chlorophyll-react";
import { useRouter } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowRightIcon } from "lucide-react";
import { useMemo } from "react";
import { css } from "styled-system/css";
import { DataTable, type DataTableFilter } from "@/components/data-table";
import { CodeChip } from "../../../-components/code-chip";
import { EditableCell } from "../../../-components/editable-cell";
import { GroupSelectCell } from "../../../-components/group-select-cell";
import { formatDuration } from "../../../-functions/format-duration";
import { formatPoint } from "../../../-functions/format-point";
import type { RailwayGroup } from "../../../-types";
import { updateRailwayGroup, updateRailwaySlug } from "../../-api/get-railways";
import type { RailwayRow } from "../../-types";

const sectionStyle = css({
    display: "inline-flex",
    alignItems: "center",
    gap: "1.5",
    fontWeight: "medium",
});

const arrowIconStyle = css({
    width: "3.5",
    height: "3.5",
    color: "fg.subtle",
    flexShrink: "0",
});

const worldStyle = css({ textStyle: "xs", color: "fg.muted" });

// 上に並べる絞り込み。選択肢は表示中のデータから自動で作られる
const FILTERS: readonly DataTableFilter[] = [
    { columnId: "groupName", label: "グループ" },
    { columnId: "lineType", label: "種別" },
    { columnId: "world", label: "ワールド" },
];

const columnHelper = createColumnHelper<RailwayRow>();

export interface RailwaysTableProps {
    readonly data: RailwayRow[];
    /** 所属グループを選び直すための選択肢 */
    readonly groups: RailwayGroup[];
}

/**
 * AdvanceRailway の路線一覧テーブル。
 * 区間とグループは ID ではなく loader で解決済みの名前を表示し、
 * slug と所属グループは表の中でそのまま書き換えられる。
 */
export function RailwaysTable({ data, groups }: RailwaysTableProps) {
    const router = useRouter();

    const columns = useMemo(
        () => [
            columnHelper.accessor("lineType", {
                header: "種別",
                cell: (info) => (
                    <Badge variant="subtle" size="sm">
                        {info.getValue()}
                    </Badge>
                ),
            }),
            // 区間は 2 つの駅にまたがる表示なので、並べ替えの基準には出発駅名を使う
            columnHelper.accessor("fromStationName", {
                id: "section",
                header: "区間",
                cell: (info) => (
                    <span className={sectionStyle}>
                        <span>{info.getValue()}</span>
                        <ArrowRightIcon
                            className={arrowIconStyle}
                            aria-label="から"
                        />
                        <span>{info.row.original.toStationName}</span>
                    </span>
                ),
            }),
            columnHelper.accessor("slug", {
                header: "slug",
                cell: (info) => (
                    <EditableCell
                        value={info.getValue()}
                        label="路線の slug"
                        onSave={async (slug) => {
                            // 更新は必ず UUID 宛てに送る。slug 自体が変わるため
                            await updateRailwaySlug({
                                data: { id: info.row.original.id, slug },
                            });
                            await router.invalidate();
                        }}
                    />
                ),
            }),
            // 並べ替えの基準は表示名。書き換えは UUID で行う
            columnHelper.accessor("groupName", {
                header: "グループ",
                cell: (info) => (
                    <GroupSelectCell
                        value={info.row.original.group}
                        groups={groups}
                        onSave={async (groupId) => {
                            await updateRailwayGroup({
                                data: { id: info.row.original.id, groupId },
                            });
                            await router.invalidate();
                        }}
                    />
                ),
            }),
            columnHelper.accessor("timeRequired", {
                header: "所要時間",
                cell: (info) => formatDuration(info.getValue()),
            }),
            columnHelper.accessor("world", {
                header: "ワールド",
                cell: (info) => (
                    <span className={worldStyle}>{info.getValue()}</span>
                ),
            }),
            // 座標は大小を比べても意味がないので並べ替えの対象から外す
            columnHelper.accessor("startPoint", {
                header: "始点座標",
                enableSorting: false,
                cell: (info) => (
                    <CodeChip>{formatPoint(info.getValue())}</CodeChip>
                ),
            }),
            columnHelper.accessor("endPoint", {
                header: "終点座標",
                enableSorting: false,
                cell: (info) => (
                    <CodeChip>{formatPoint(info.getValue())}</CodeChip>
                ),
            }),
        ],
        [groups, router],
    );

    return (
        <DataTable
            data={data}
            columns={columns}
            filters={FILTERS}
            emptyMessage="路線が登録されていません"
        />
    );
}
