import { Badge } from "@morinoparty/chlorophyll-react";
import { useRouter } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { useMemo } from "react";
import { css } from "styled-system/css";
import { DataTable, type DataTableFilter } from "@/components/data-table";
import { CodeChip } from "../../../-components/code-chip";
import { ColorSwatch } from "../../../-components/color-swatch";
import { EditableCell } from "../../../-components/editable-cell";
import { formatPoint } from "../../../-functions/format-point";
import type { StationItem } from "../../../-types";
import { updateStationSlug } from "../../-api/get-stations";

const nameStyle = css({ fontWeight: "medium", color: "fg" });

const mutedTextStyle = css({ textStyle: "xs", color: "fg.subtle" });

const worldStyle = css({ textStyle: "xs", color: "fg.muted" });

const numberingListStyle = css({
    display: "inline-flex",
    flexWrap: "wrap",
    gap: "1",
});

// 上に並べる絞り込み。選択肢は表示中のデータから自動で作られる
const FILTERS: readonly DataTableFilter[] = [
    { columnId: "world", label: "ワールド" },
];

const columnHelper = createColumnHelper<StationItem>();

/**
 * AdvanceRailway の駅一覧テーブル。
 * slug は表の中でそのまま書き換えられる。
 */
export function StationsTable({ data }: { data: StationItem[] }) {
    const router = useRouter();

    const columns = useMemo(
        () => [
            columnHelper.accessor("name", {
                header: "駅名",
                cell: (info) => (
                    <span className={nameStyle}>{info.getValue()}</span>
                ),
            }),
            columnHelper.accessor("slug", {
                header: "slug",
                cell: (info) => (
                    <EditableCell
                        value={info.getValue()}
                        label="駅の slug"
                        onSave={async (slug) => {
                            // 更新は必ず UUID 宛てに送る。slug 自体が変わるため
                            await updateStationSlug({
                                data: { id: info.row.original.id, slug },
                            });
                            await router.invalidate();
                        }}
                    />
                ),
            }),
            // 1 つの駅が複数グループに属しうるので、採番はグループごとに並べる。
            // 並べ替えの基準には採番済みの件数を使う
            columnHelper.accessor(
                (row) =>
                    row.numberings.filter((entry) => entry.numbering).length,
                {
                    id: "numberings",
                    header: "ナンバリング",
                    cell: (info) => {
                        const numberings = info.row.original.numberings.filter(
                            (entry) => entry.numbering,
                        );
                        if (numberings.length === 0) {
                            return <span className={mutedTextStyle}>なし</span>;
                        }
                        return (
                            <span className={numberingListStyle}>
                                {numberings.map((entry) => (
                                    <Badge
                                        key={entry.group}
                                        variant="subtle"
                                        size="sm"
                                        title={entry.groupName}
                                    >
                                        {entry.numbering}
                                    </Badge>
                                ))}
                            </span>
                        );
                    },
                },
            ),
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
        ],
        [router],
    );

    return (
        <DataTable
            data={data}
            columns={columns}
            filters={FILTERS}
            emptyMessage="駅が登録されていません"
        />
    );
}
