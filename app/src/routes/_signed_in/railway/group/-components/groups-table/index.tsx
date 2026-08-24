import { useRouter } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { useMemo } from "react";
import { css } from "styled-system/css";
import { DataTable } from "@/components/data-table";
import { ColorSwatch } from "../../../-components/color-swatch";
import { EditableCell } from "../../../-components/editable-cell";
import type { RailwayGroup } from "../../../-types";
import { updateGroupSlug } from "../../-api/get-groups";

const nameStyle = css({ fontWeight: "medium", color: "fg" });

const mutedTextStyle = css({ textStyle: "xs", color: "fg.subtle" });

const columnHelper = createColumnHelper<RailwayGroup>();

/**
 * AdvanceRailway のグループ一覧テーブル。
 * slug は表の中でそのまま書き換えられる。
 */
export function GroupsTable({ data }: { data: RailwayGroup[] }) {
    const router = useRouter();

    const columns = useMemo(
        () => [
            columnHelper.accessor("name", {
                header: "グループ名",
                cell: (info) => (
                    <span className={nameStyle}>{info.getValue()}</span>
                ),
            }),
            columnHelper.accessor("slug", {
                header: "slug",
                cell: (info) => (
                    <EditableCell
                        value={info.getValue()}
                        label="グループの slug"
                        onSave={async (slug) => {
                            // 更新は必ず UUID 宛てに送る。slug 自体が変わるため
                            await updateGroupSlug({
                                data: { id: info.row.original.id, slug },
                            });
                            await router.invalidate();
                        }}
                    />
                ),
            }),
            columnHelper.accessor("color", {
                header: "カラー",
                cell: (info) => <ColorSwatch color={info.getValue()} />,
            }),
            columnHelper.accessor("numberingPrefix", {
                header: "ナンバリング接頭辞",
                cell: (info) => {
                    const prefix = info.getValue();
                    return prefix ? (
                        prefix
                    ) : (
                        <span className={mutedTextStyle}>なし</span>
                    );
                },
            }),
            columnHelper.accessor("numberingStart", {
                header: "開始番号",
                cell: (info) => info.getValue(),
            }),
        ],
        [router],
    );

    return (
        <DataTable
            data={data}
            columns={columns}
            emptyMessage="グループが登録されていません"
        />
    );
}
