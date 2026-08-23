import { ark, type HTMLArkProps } from "@ark-ui/react/factory";
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    type SortingState,
    type TableOptions,
    useReactTable,
} from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon } from "lucide-react";
import { type ReactNode, useState } from "react";
import { css, cx } from "styled-system/css";

// --- スタイル定義 -------------------------------------------------------

const tableContainerStyle = css({
    width: "full",
    overflowX: "auto",
    borderRadius: "lg",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "border.subtle",
    bg: "bg.panel",
    boxShadow: "sm",
});

const tableStyle = css({
    width: "full",
    captionSide: "bottom",
    textStyle: "sm",
    borderCollapse: "collapse",
    textAlign: "start",
});

const headerStyle = css({
    bg: "bg.subtle",
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    borderColor: "border.subtle",
});

const bodyStyle = css({
    "& tr:last-child": {
        borderBottomWidth: "0",
    },
});

const footerStyle = css({
    borderTopWidth: "1px",
    borderTopStyle: "solid",
    borderColor: "border.subtle",
    bg: "bg.subtle",
    fontWeight: "medium",
});

const rowStyle = css({
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    borderColor: "border.subtle",
    transitionProperty: "background-color",
    transitionDuration: "fast",
    transitionTimingFunction: "easeInOut",
    _hover: {
        bg: "bg.muted",
    },
    "&[data-state='selected']": {
        bg: "colorPalette.bg.subtle",
    },
});

const headStyle = css({
    h: "10",
    px: "4",
    py: "2",
    textAlign: "start",
    verticalAlign: "middle",
    fontWeight: "semibold",
    textStyle: "xs",
    color: "fg.muted",
    letterSpacing: "wider",
    userSelect: "none",
    whiteSpace: "nowrap",
});

const cellStyle = css({
    px: "4",
    py: "3",
    verticalAlign: "middle",
    color: "fg",
    whiteSpace: "nowrap",
});

const captionStyle = css({
    mt: "4",
    textStyle: "xs",
    color: "fg.muted",
    textAlign: "center",
});

const emptyStyle = css({
    px: "4",
    py: "8",
    textAlign: "center",
    color: "fg.muted",
    textStyle: "sm",
});

// 並べ替えできる見出しはボタンにする。th 全体を押せるようにすると
// スクリーンリーダーでの読み上げが冗長になるため、ラベルだけをボタンにする
const sortButtonStyle = css({
    display: "inline-flex",
    alignItems: "center",
    gap: "1.5",
    cursor: "pointer",
    color: "inherit",
    font: "inherit",
    letterSpacing: "inherit",
    borderRadius: "sm",
    _hover: { color: "fg" },
    // outline: "none" だと outline-style が none のまま残り、
    // フォーカスリングが描かれない
    _focusVisible: {
        outlineStyle: "solid",
        outlineWidth: "2px",
        outlineColor: "colorPalette.focus.ring",
        outlineOffset: "2px",
    },
    "& :where(svg)": {
        width: "3.5",
        height: "3.5",
        flexShrink: "0",
    },
});

// 未ソートの列のアイコンは、並べ替えできることだけを控えめに示す
const sortIconIdleStyle = css({ color: "fg.subtle", opacity: "0.6" });

// --- プリミティブ -------------------------------------------------------

export interface TableRootProps extends HTMLArkProps<"table"> {
    /** 横スクロールコンテナに追加するクラス名 */
    containerClassName?: string;
}

function TableRoot({
    className,
    containerClassName,
    children,
    ...props
}: TableRootProps) {
    return (
        <div className={cx(tableContainerStyle, containerClassName)}>
            <ark.table {...props} className={cx(tableStyle, className)}>
                {children}
            </ark.table>
        </div>
    );
}

export type TableHeaderProps = HTMLArkProps<"thead">;
function TableHeader({ className, ...props }: TableHeaderProps) {
    return <ark.thead {...props} className={cx(headerStyle, className)} />;
}

export type TableBodyProps = HTMLArkProps<"tbody">;
function TableBody({ className, ...props }: TableBodyProps) {
    return <ark.tbody {...props} className={cx(bodyStyle, className)} />;
}

export type TableFooterProps = HTMLArkProps<"tfoot">;
function TableFooter({ className, ...props }: TableFooterProps) {
    return <ark.tfoot {...props} className={cx(footerStyle, className)} />;
}

export type TableRowProps = HTMLArkProps<"tr">;
function TableRow({ className, ...props }: TableRowProps) {
    return <ark.tr {...props} className={cx(rowStyle, className)} />;
}

export type TableHeadProps = HTMLArkProps<"th">;
function TableHead({ className, ...props }: TableHeadProps) {
    return <ark.th {...props} className={cx(headStyle, className)} />;
}

export type TableCellProps = HTMLArkProps<"td">;
function TableCell({ className, ...props }: TableCellProps) {
    return <ark.td {...props} className={cx(cellStyle, className)} />;
}

export type TableCaptionProps = HTMLArkProps<"caption">;
function TableCaption({ className, ...props }: TableCaptionProps) {
    return <ark.caption {...props} className={cx(captionStyle, className)} />;
}

export interface TableEmptyProps {
    readonly colSpan: number;
    readonly children?: ReactNode;
}
function TableEmpty({
    colSpan,
    children = "データがありません",
}: TableEmptyProps) {
    return (
        <ark.tr className={rowStyle}>
            <ark.td colSpan={colSpan} className={emptyStyle}>
                {children}
            </ark.td>
        </ark.tr>
    );
}

export const Table = Object.assign(TableRoot, {
    Root: TableRoot,
    Header: TableHeader,
    Body: TableBody,
    Footer: TableFooter,
    Row: TableRow,
    Head: TableHead,
    Cell: TableCell,
    Caption: TableCaption,
    Empty: TableEmpty,
});

// --- TanStack Table と組み合わせた表 ------------------------------------

// TanStack Table の列定義は列ごとに値の型が違うため、配列としては
// ライブラリ側の型 (`ColumnDef<TData, any>[]`) をそのまま借りる
type ColumnDefs<TData> = TableOptions<TData>["columns"];

export interface DataTableProps<TData> {
    /** 表示する行。loader から受け取った配列をそのまま渡す */
    readonly data: TData[];
    /** `createColumnHelper<TData>()` で組み立てた列定義 */
    readonly columns: ColumnDefs<TData>;
    /** 行が 1 件もないときの文言 */
    readonly emptyMessage?: ReactNode;
    /** 表の下に添える説明 */
    readonly caption?: ReactNode;
}

/**
 * TanStack Table の状態管理と、Table プリミティブによる描画をまとめたコンポーネント。
 * 呼び出し側は列定義とデータだけを与えればよい。
 *
 * 列の並べ替えは既定で有効。無効にしたい列は列定義で `enableSorting: false` を指定する。
 */
export function DataTable<TData>({
    data,
    columns,
    emptyMessage,
    caption,
}: DataTableProps<TData>) {
    const [sorting, setSorting] = useState<SortingState>([]);

    const table = useReactTable({
        data,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const rows = table.getRowModel().rows;

    return (
        <Table>
            <Table.Header>
                {table.getHeaderGroups().map((headerGroup) => (
                    <Table.Row key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                            if (header.isPlaceholder) {
                                return <Table.Head key={header.id} />;
                            }

                            const label = flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                            );
                            const sortDirection = header.column.getIsSorted();

                            return (
                                <Table.Head
                                    key={header.id}
                                    aria-sort={ariaSortOf(sortDirection)}
                                >
                                    {header.column.getCanSort() ? (
                                        <button
                                            type="button"
                                            className={sortButtonStyle}
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            {label}
                                            <SortIcon
                                                direction={sortDirection}
                                            />
                                        </button>
                                    ) : (
                                        label
                                    )}
                                </Table.Head>
                            );
                        })}
                    </Table.Row>
                ))}
            </Table.Header>
            <Table.Body>
                {rows.length > 0 ? (
                    rows.map((row) => (
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
                    <Table.Empty colSpan={table.getAllLeafColumns().length}>
                        {emptyMessage}
                    </Table.Empty>
                )}
            </Table.Body>
            {caption ? <Table.Caption>{caption}</Table.Caption> : null}
        </Table>
    );
}

// TanStack Table の並び順を、そのまま aria-sort の値に読み替える
const ariaSortOf = (
    direction: false | "asc" | "desc",
): "ascending" | "descending" | "none" => {
    if (direction === "asc") return "ascending";
    if (direction === "desc") return "descending";
    return "none";
};

function SortIcon({ direction }: { direction: false | "asc" | "desc" }) {
    if (direction === "asc") {
        return <ArrowUpIcon aria-hidden="true" />;
    }
    if (direction === "desc") {
        return <ArrowDownIcon aria-hidden="true" />;
    }
    return (
        <ChevronsUpDownIcon aria-hidden="true" className={sortIconIdleStyle} />
    );
}
