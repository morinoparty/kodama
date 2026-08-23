import { Badge } from "@morinoparty/chlorophyll-react";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ArrowRightIcon } from "lucide-react";
import { useMemo } from "react";
import { css } from "styled-system/css";
import { Table } from "@/components/data-table";
import { formatDuration, formatPoint } from "../../-functions/format-duration";
import type { RailwayItem } from "../../-types";

interface RailwaysTableProps {
    readonly data: readonly RailwayItem[];
}

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
    flexShrink: 0,
});

const codeStyle = css({
    fontFamily: "mono",
    textStyle: "xs",
    color: "fg.muted",
    bg: "bg.muted",
    px: "1.5",
    py: "0.5",
    borderRadius: "sm",
});

const mutedTextStyle = css({
    textStyle: "xs",
    color: "fg.subtle",
});

const columnHelper = createColumnHelper<RailwayItem>();

/**
 * AdvanceRailway の路線一覧テーブル
 */
export function RailwaysTable({ data }: RailwaysTableProps) {
    const columns = useMemo(
        () => [
            columnHelper.accessor("id", {
                header: "ID",
                cell: (info) => (
                    <code className={codeStyle}>{info.getValue()}</code>
                ),
            }),
            columnHelper.accessor("lineType", {
                header: "種別",
                cell: (info) => (
                    <Badge variant="subtle" size="sm">
                        {info.getValue()}
                    </Badge>
                ),
            }),
            columnHelper.display({
                id: "section",
                header: "区間",
                cell: (info) => {
                    const row = info.row.original;
                    return (
                        <div className={sectionStyle}>
                            <span>{row.fromStation}</span>
                            <ArrowRightIcon className={arrowIconStyle} />
                            <span>{row.toStation}</span>
                        </div>
                    );
                },
            }),
            columnHelper.accessor("group", {
                header: "グループ",
                cell: (info) => {
                    const val = info.getValue();
                    return val ? (
                        <Badge variant="outline" size="sm">
                            {val}
                        </Badge>
                    ) : (
                        <span className={mutedTextStyle}>なし</span>
                    );
                },
            }),
            columnHelper.accessor("timeRequired", {
                header: "所要時間",
                cell: (info) => (
                    <span className={css({ textStyle: "sm", color: "fg" })}>
                        {formatDuration(info.getValue())}
                    </span>
                ),
            }),
            columnHelper.accessor("world", {
                header: "ワールド",
                cell: (info) => (
                    <span
                        className={css({ textStyle: "xs", color: "fg.muted" })}
                    >
                        {info.getValue()}
                    </span>
                ),
            }),
            columnHelper.accessor("startPoint", {
                header: "始点座標",
                cell: (info) => (
                    <code className={codeStyle}>
                        {formatPoint(info.getValue())}
                    </code>
                ),
            }),
            columnHelper.accessor("endPoint", {
                header: "終点座標",
                cell: (info) => (
                    <code className={codeStyle}>
                        {formatPoint(info.getValue())}
                    </code>
                ),
            }),
        ],
        [],
    );

    const table = useReactTable({
        data: data as RailwayItem[],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <Table>
            <Table.Header>
                {table.getHeaderGroups().map((headerGroup) => (
                    <Table.Row key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <Table.Head key={header.id}>
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                          header.column.columnDef.header,
                                          header.getContext(),
                                      )}
                            </Table.Head>
                        ))}
                    </Table.Row>
                ))}
            </Table.Header>
            <Table.Body>
                {table.getRowModel().rows.length > 0 ? (
                    table.getRowModel().rows.map((row) => (
                        <Table.Row key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <Table.Cell key={cell.id}>
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext(),
                                    )}
                                </Table.Cell>
                            ))}
                        </Table.Row>
                    ))
                ) : (
                    <Table.Empty colSpan={columns.length}>
                        路線が登録されていません
                    </Table.Empty>
                )}
            </Table.Body>
        </Table>
    );
}
