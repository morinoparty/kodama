import { useRouter } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { useMemo } from "react";
import { css } from "styled-system/css";
import { DataTable } from "@/components/data-table";
import { ColorSwatch } from "../../../-components/color-swatch";
import { EditableCell } from "../../../-components/editable-cell";
import type { RailwayGroup } from "../../../-types";
import { updateGroupName, updateGroupSlug } from "../../-api/get-groups";

// 名前は一覧の主役なので少し強く見せる。Editable の preview / input は
// 書体を継承するので、外側に指定すれば表示と編集で見え方が揃う
const nameStyle = css({ fontWeight: "medium", color: "fg" });

const mutedTextStyle = css({ textStyle: "xs", color: "fg.subtle" });

const columnHelper = createColumnHelper<RailwayGroup>();

/**
 * AdvanceRailway のグループ一覧テーブル。
 * グループ名と slug は表の中でそのまま書き換えられる。
 */
export function GroupsTable({ data }: { data: RailwayGroup[] }) {
    const router = useRouter();

    const columns = useMemo(
        () => [
            columnHelper.accessor("name", {
                header: "グループ名",
                cell: (info) => (
                    <span className={nameStyle}>
                        <EditableCell
                            value={info.getValue()}
                            label="グループ名"
                            onSave={async (name) => {
                                await updateGroupName({
                                    data: { id: info.row.original.id, name },
                                });
                                await router.invalidate();
                            }}
                        />
                    </span>
                ),
            }),
            columnHelper.accessor("slug", {
                header: "slug",
                cell: (info) => (
                    <EditableCell
                        value={info.getValue()}
                        label="グループの slug"
                        mono
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
