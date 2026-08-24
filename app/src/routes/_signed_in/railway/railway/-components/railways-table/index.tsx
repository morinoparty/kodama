import { Badge } from "@morinoparty/chlorophyll-react";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowRightIcon } from "lucide-react";
import { useMemo } from "react";
import { css } from "styled-system/css";
import { DataTable } from "@/components/data-table";
import { CodeChip } from "../../../-components/code-chip";
import { formatDuration } from "../../../-functions/format-duration";
import { formatPoint } from "../../../-functions/format-point";
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

const mutedTextStyle = css({ textStyle: "xs", color: "fg.subtle" });

const worldStyle = css({ textStyle: "xs", color: "fg.muted" });

const columnHelper = createColumnHelper<RailwayRow>();

/**
 * AdvanceRailway の路線一覧テーブル。
 * 区間とグループは ID ではなく、loader で解決済みの名前を表示する。
 */
export function RailwaysTable({ data }: { data: RailwayRow[] }) {
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
            columnHelper.accessor("groupName", {
                header: "グループ",
                cell: (info) => {
                    const groupName = info.getValue();
                    return groupName ? (
                        <Badge variant="outline" size="sm">
                            {groupName}
                        </Badge>
                    ) : (
                        <span className={mutedTextStyle}>なし</span>
                    );
                },
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
            columnHelper.accessor("id", {
                header: "ID",
                cell: (info) => <CodeChip>{info.getValue()}</CodeChip>,
            }),
        ],
        [],
    );

    return (
        <DataTable
            data={data}
            columns={columns}
            emptyMessage="路線が登録されていません"
        />
    );
}
