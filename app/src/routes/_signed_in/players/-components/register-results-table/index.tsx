import { Badge } from "@morinoparty/chlorophyll-react";
import { createColumnHelper } from "@tanstack/react-table";
import { css } from "styled-system/css";
import { DataTable } from "@/components/data-table";
import { STATUS_LABELS } from "../../-functions/status-label";
import type { RegisterResult, RegisterStatus } from "../../-types";

// 表示用の 1 行。同じ UUID を何度送っても行を区別できるよう、送った順の番号を持たせる
export interface RegisterResultRow extends RegisterResult {
    readonly index: number;
}

export interface RegisterResultsTableProps {
    readonly rows: RegisterResultRow[];
}

const uuidStyle = css({ fontFamily: "mono", textStyle: "xs" });

const subtleTextStyle = css({ color: "fg.subtle" });

// 失敗の原因は長くなりうるので、この列だけは折り返す
const detailStyle = css({
    textStyle: "xs",
    color: "fg.muted",
    whiteSpace: "normal",
    wordBreak: "break-all",
    minWidth: "60",
});

const isRegisterStatus = (value: string): value is RegisterStatus =>
    Object.hasOwn(STATUS_LABELS, value);

const columnHelper = createColumnHelper<RegisterResultRow>();

const columns = [
    columnHelper.accessor("index", {
        header: "#",
        meta: { width: "1%" },
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("status", {
        header: "状態",
        meta: { width: "1%" },
        cell: (info) => {
            const label = STATUS_LABELS[info.getValue()];
            return (
                <Badge variant="subtle" status={label.tone}>
                    {label.label}
                </Badge>
            );
        },
    }),
    columnHelper.accessor("uuid", {
        header: "UUID",
        cell: (info) => <span className={uuidStyle}>{info.getValue()}</span>,
    }),
    columnHelper.accessor("name", {
        header: "名前",
        // 一括登録の応答には名前が含まれないため、空のことがある
        cell: (info) =>
            info.getValue() ?? <span className={subtleTextStyle}>—</span>,
    }),
    columnHelper.display({
        id: "detail",
        header: "詳細",
        cell: ({ row }) => (
            <span className={detailStyle}>
                {row.original.message ??
                    STATUS_LABELS[row.original.status].description}
            </span>
        ),
    }),
];

/**
 * mc-api への登録結果を 1 件ずつ並べる表。
 * 状態は色付きの Badge で示し、状態ごとに絞り込める
 */
export function RegisterResultsTable({ rows }: RegisterResultsTableProps) {
    return (
        <DataTable
            data={rows}
            columns={columns}
            emptyMessage="まだ登録していません。"
            filters={[
                {
                    columnId: "status",
                    label: "状態",
                    // 絞り込みの選択肢にも日本語のラベルを使う
                    formatValue: (value) =>
                        isRegisterStatus(value)
                            ? STATUS_LABELS[value].label
                            : value,
                },
            ]}
        />
    );
}
