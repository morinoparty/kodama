import { Table } from "@morinoparty/chlorophyll-react";
import {
    type ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    type RowData,
    type SortingState,
    type TableOptions,
    type Table as TanStackTable,
    useReactTable,
} from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon } from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";
import { css } from "styled-system/css";
import { Select } from "../select";

// 表の見た目は Chlorophyll の Table が持っている。ここではその上に
// TanStack Table の状態管理 (並べ替え・絞り込み) を載せている

// --- スタイル定義 -------------------------------------------------------

// 列が多い一覧なので、セルは折り返さず横スクロールで見せる。
// 列幅の指定 (`meta.width: "1%"`) もセルが縮まないことを前提にしている
const cellStyle = css({ whiteSpace: "nowrap" });

// 見出しを押して並べ替えられることが分かるよう、ラベルをボタンにする。
// th 全体を押せるようにするとスクリーンリーダーでの読み上げが冗長になる
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

// 列ごとの見た目の指定。列定義の `meta` に書くと、その列の th に反映される
declare module "@tanstack/react-table" {
    interface ColumnMeta<TData extends RowData, TValue> {
        /**
         * 列の幅。CSS の値をそのまま渡す。
         * `"1%"` にすると、その列は中身の幅まで縮む (セルは nowrap のため)
         */
        readonly width?: string;
    }
}

// --- 絞り込み -----------------------------------------------------------

// 絞り込みバーと表を縦に積む
const tableSectionStyle = css({
    display: "flex",
    flexDirection: "column",
    gap: "3",
});

const filterBarStyle = css({
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "3",
});

const filterFieldStyle = css({
    display: "inline-flex",
    alignItems: "center",
    gap: "2",
});

const filterLabelStyle = css({
    textStyle: "xs",
    fontWeight: "semibold",
    color: "fg.muted",
    whiteSpace: "nowrap",
});

const filterCountStyle = css({
    textStyle: "xs",
    color: "fg.subtle",
    ml: "auto",
});

// 「すべて」と「なし」を表す番兵。Select は文字列しか扱えないため、
// 絞り込みなしと空値をこの値で表す
const ALL_VALUE = "__all__";
const NONE_VALUE = "__none__";

/** セルの値を、Select で扱える文字列に落とす */
const toFilterValue = (value: unknown): string =>
    value === null || value === undefined || value === ""
        ? NONE_VALUE
        : String(value);

/**
 * 選んだ値と完全一致する行だけを残す。
 * 既定の絞り込みは部分一致なので、Select 用にここで差し替える。
 *
 * `FilterFn<TData>` と書くと TData が unknown に潰れて列定義が渡せなくなるため、
 * 行は「値を引ける何か」として受ける
 */
const equalsSelected = (
    row: { getValue: (columnId: string) => unknown },
    columnId: string,
    filterValue: unknown,
): boolean => toFilterValue(row.getValue(columnId)) === filterValue;

export interface DataTableFilter {
    /** 絞り込む列の id */
    readonly columnId: string;
    /** Select の見出し */
    readonly label: string;
    /** 値の表示名。省略すると値をそのまま出す */
    readonly formatValue?: (value: string) => string;
}

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
    /** 表の上に並べる絞り込みの Select。選択肢はデータから自動で作る */
    readonly filters?: readonly DataTableFilter[];
}

/**
 * TanStack Table の状態管理と、Chlorophyll の Table による描画をまとめたコンポーネント。
 * 呼び出し側は列定義とデータだけを与えればよい。
 *
 * 列の並べ替えは既定で有効。無効にしたい列は列定義で `enableSorting: false` を指定する。
 */
export function DataTable<TData>({
    data,
    columns,
    emptyMessage,
    caption,
    filters,
}: DataTableProps<TData>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const table = useReactTable({
        data,
        columns,
        state: { sorting, columnFilters },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        // Select の絞り込みは完全一致で行う。列側で filterFn を指定していれば
        // そちらが優先される
        defaultColumn: { filterFn: equalsSelected },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    const rows = table.getRowModel().rows;
    const totalCount = table.getCoreRowModel().rows.length;
    const isFiltered = columnFilters.length > 0;

    return (
        <div className={tableSectionStyle}>
            {filters && filters.length > 0 ? (
                <div className={filterBarStyle}>
                    {filters.map((filter) => (
                        <FilterSelect
                            key={filter.columnId}
                            filter={filter}
                            table={table}
                        />
                    ))}
                    <span className={filterCountStyle}>
                        {isFiltered
                            ? `${rows.length} / ${totalCount} 件`
                            : `${totalCount} 件`}
                    </span>
                </div>
            ) : null}

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
                                const sortDirection =
                                    header.column.getIsSorted();

                                return (
                                    <Table.Head
                                        key={header.id}
                                        aria-sort={ariaSortOf(sortDirection)}
                                        style={{
                                            width: header.column.columnDef.meta
                                                ?.width,
                                        }}
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
                                    <Table.Cell
                                        key={cell.id}
                                        className={cellStyle}
                                    >
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
                            {isFiltered
                                ? "条件に合う行がありません"
                                : emptyMessage}
                        </Table.Empty>
                    )}
                </Table.Body>
                {caption ? <Table.Caption>{caption}</Table.Caption> : null}
            </Table>
        </div>
    );
}

/**
 * 1 つの列を絞り込む Select。
 *
 * 選択肢は絞り込み前の全行から作るので、他の絞り込みを変えても
 * 選べる値が消えない。
 */
function FilterSelect<TData>({
    filter,
    table,
}: {
    filter: DataTableFilter;
    table: TanStackTable<TData>;
}) {
    const { columnId, label, formatValue } = filter;
    const column = table.getColumn(columnId);
    const coreRows = table.getCoreRowModel().rows;

    const options = useMemo(() => {
        const values = new Set<string>();
        for (const row of coreRows) {
            values.add(toFilterValue(row.getValue(columnId)));
        }

        // 空値は「なし」として最後にまとめる
        const hasNone = values.delete(NONE_VALUE);
        const sorted = [...values].sort((a, b) => a.localeCompare(b, "ja"));

        return [
            { label: "すべて", value: ALL_VALUE },
            ...sorted.map((value) => ({
                label: formatValue ? formatValue(value) : value,
                value,
            })),
            ...(hasNone ? [{ label: "なし", value: NONE_VALUE }] : []),
        ];
    }, [coreRows, columnId, formatValue]);

    if (!column) {
        return null;
    }

    const current =
        (column.getFilterValue() as string | undefined) ?? ALL_VALUE;

    return (
        <span className={filterFieldStyle}>
            <span className={filterLabelStyle} aria-hidden="true">
                {label}
            </span>
            <Select
                label={`${label}で絞り込む`}
                size="sm"
                value={current}
                options={options}
                onValueChange={(value) =>
                    column.setFilterValue(
                        value === ALL_VALUE ? undefined : value,
                    )
                }
            />
        </span>
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
