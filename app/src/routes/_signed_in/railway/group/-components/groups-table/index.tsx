import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { css } from "styled-system/css";
import { Table } from "@/components/data-table";
import type { RailwayGroup } from "../../-types";

interface GroupsTableProps {
    readonly data: readonly RailwayGroup[];
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

const columnHelper = createColumnHelper<RailwayGroup>();

/**
 * AdvanceRailway のグループ一覧テーブル
 */
export function GroupsTable({ data }: GroupsTableProps) {
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
            columnHelper.accessor("name", {
                header: "グループ名",
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
        ],
        [],
    );

    const table = useReactTable({
        data: data as RailwayGroup[],
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
                        グループが登録されていません
                    </Table.Empty>
                )}
            </Table.Body>
        </Table>
    );
}
