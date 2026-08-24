import { createColumnHelper } from "@tanstack/react-table";
import { useMemo } from "react";
import { css } from "styled-system/css";
import { DataTable } from "@/components/data-table";
import { CodeChip } from "../../../-components/code-chip";
import { ColorSwatch } from "../../../-components/color-swatch";
import type { RailwayGroup } from "../../../-types";

const nameStyle = css({ fontWeight: "medium", color: "fg" });

const columnHelper = createColumnHelper<RailwayGroup>();

/**
 * AdvanceRailway のグループ一覧テーブル
 */
export function GroupsTable({ data }: { data: RailwayGroup[] }) {
    const columns = useMemo(
        () => [
            columnHelper.accessor("name", {
                header: "グループ名",
                cell: (info) => (
                    <span className={nameStyle}>{info.getValue()}</span>
                ),
            }),
            columnHelper.accessor("color", {
                header: "カラー",
                cell: (info) => <ColorSwatch color={info.getValue()} />,
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
            emptyMessage="グループが登録されていません"
        />
    );
}
