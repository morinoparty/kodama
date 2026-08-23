import { Badge } from "@morinoparty/chlorophyll-react";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { css } from "styled-system/css";
import { Table } from "@/components/data-table";
import { formatPoint } from "../../-functions/format-point";
import type { StationItem } from "../../-types";

interface StationsTableProps {
    readonly data: readonly StationItem[];
}

const colorBadgeWrapperStyle = css({
    display: "inline-flex",
    alignItems: "center",
    gap: "2",
});

const colorDotStyle = css({
    width: "4",
    height: "4",
    borderRadius: "full",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "border.subtle",
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

const columnHelper = createColumnHelper<StationItem>();

/**
 * AdvanceRailway の駅一覧テーブル
 */
export function StationsTable({ data }: StationsTableProps) {
    const columns = useMemo(
        () => [
            columnHelper.accessor("color", {
                header: "カラー",
                cell: (info) => {
                    const color = info.getValue();
                    return (
                        <div className={colorBadgeWrapperStyle}>
                            <span
                                className={colorDotStyle}
                                style={{ backgroundColor: color }}
                                aria-hidden="true"
                            />
                            <code className={codeStyle}>{color}</code>
                        </div>
                    );
                },
            }),
            columnHelper.accessor("numbering", {
                header: "ナンバリング",
                cell: (info) => {
                    const val = info.getValue();
                    return val ? (
                        <Badge variant="subtle" size="sm">
                            {val}
                        </Badge>
                    ) : (
                        <span className={mutedTextStyle}>なし</span>
                    );
                },
            }),
            columnHelper.accessor("name", {
                header: "駅名",
                cell: (info) => (
                    <span
                        className={css({ fontWeight: "medium", color: "fg" })}
                    >
                        {info.getValue()}
                    </span>
                ),
            }),
            columnHelper.accessor("id", {
                header: "ID",
                cell: (info) => (
                    <code className={codeStyle}>{info.getValue()}</code>
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
            columnHelper.accessor("point", {
                header: "座標",
                cell: (info) => (
                    <code className={codeStyle}>
                        {formatPoint(info.getValue())}
                    </code>
                ),
            }),
            columnHelper.accessor("overrideSize", {
                header: "表示サイズ",
                cell: (info) => {
                    const val = info.getValue();
                    return val != null ? (
                        <span className={css({ textStyle: "sm", color: "fg" })}>
                            {val}
                        </span>
                    ) : (
                        <span className={mutedTextStyle}>自動</span>
                    );
                },
            }),
        ],
        [],
    );

    const table = useReactTable({
        data: data as StationItem[],
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
                        駅が登録されていません
                    </Table.Empty>
                )}
            </Table.Body>
        </Table>
    );
}
