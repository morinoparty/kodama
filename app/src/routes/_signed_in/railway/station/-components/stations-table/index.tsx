import { Badge } from "@morinoparty/chlorophyll-react";
import { createColumnHelper } from "@tanstack/react-table";
import { useMemo } from "react";
import { css } from "styled-system/css";
import { DataTable } from "@/components/data-table";
import { CodeChip } from "../../../-components/code-chip";
import { ColorSwatch } from "../../../-components/color-swatch";
import { formatPoint } from "../../../-functions/format-point";
import type { StationItem } from "../../../-types";

const nameStyle = css({ fontWeight: "medium", color: "fg" });

const mutedTextStyle = css({ textStyle: "xs", color: "fg.subtle" });

const worldStyle = css({ textStyle: "xs", color: "fg.muted" });

const columnHelper = createColumnHelper<StationItem>();

/**
 * AdvanceRailway の駅一覧テーブル
 */
export function StationsTable({ data }: { data: StationItem[] }) {
    const columns = useMemo(
        () => [
            columnHelper.accessor("name", {
                header: "駅名",
                cell: (info) => (
                    <span className={nameStyle}>{info.getValue()}</span>
                ),
            }),
            columnHelper.accessor("numbering", {
                header: "ナンバリング",
                cell: (info) => {
                    const numbering = info.getValue();
                    return numbering ? (
                        <Badge variant="subtle" size="sm">
                            {numbering}
                        </Badge>
                    ) : (
                        <span className={mutedTextStyle}>なし</span>
                    );
                },
            }),
            columnHelper.accessor("color", {
                header: "カラー",
                cell: (info) => <ColorSwatch color={info.getValue()} />,
            }),
            columnHelper.accessor("world", {
                header: "ワールド",
                cell: (info) => (
                    <span className={worldStyle}>{info.getValue()}</span>
                ),
            }),
            // 座標は大小を比べても意味がないので並べ替えの対象から外す
            columnHelper.accessor("point", {
                header: "座標",
                enableSorting: false,
                cell: (info) => (
                    <CodeChip>{formatPoint(info.getValue())}</CodeChip>
                ),
            }),
            columnHelper.accessor("overrideSize", {
                header: "表示サイズ",
                cell: (info) => {
                    const size = info.getValue();
                    return size == null ? (
                        <span className={mutedTextStyle}>自動</span>
                    ) : (
                        size
                    );
                },
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
            emptyMessage="駅が登録されていません"
        />
    );
}
