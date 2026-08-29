import { Badge } from "@morinoparty/chlorophyll-react";
import { createColumnHelper } from "@tanstack/react-table";
import { useMemo } from "react";
import { css } from "styled-system/css";
import { DataTable, type DataTableFilter } from "@/components/data-table";
import type { PluginItem } from "../../-types";

// プラグイン名は一覧の主役なので少し強く見せる
const nameStyle = css({ fontWeight: "medium", color: "fg" });

// バージョンは桁を見比べるので等幅で出す
const versionStyle = css({ fontFamily: "mono", textStyle: "sm" });

// 最新から遅れているバージョンは、並んだときに目で追えるよう色を変える
const outdatedVersionStyle = css({
    fontFamily: "mono",
    textStyle: "sm",
    color: "fg.muted",
});

const descriptionStyle = css({
    textStyle: "xs",
    color: "fg.subtle",
    // 説明は長くなりうるので、この列だけは折り返して読ませる
    whiteSpace: "normal",
    maxWidth: "80",
    display: "inline-block",
});

// 上に並べる絞り込み。選択肢は表示中のデータから自動で作られる
const FILTERS: readonly DataTableFilter[] = [
    {
        columnId: "status",
        label: "状態",
    },
];

/** 更新の要否と更新停止を、1 つの状態としてまとめて見せる */
const statusOf = (plugin: PluginItem): string => {
    if (plugin.isLocked) return "更新停止中";
    return plugin.isOutdated ? "更新あり" : "最新";
};

const columnHelper = createColumnHelper<PluginItem>();

export interface PluginsTableProps {
    readonly data: PluginItem[];
}

/**
 * MPM が返すプラグイン一覧のテーブル。
 * 導入済みのバージョンと最新バージョンを並べて、更新の要否を見せる。
 */
export function PluginsTable({ data }: PluginsTableProps) {
    const columns = useMemo(
        () => [
            columnHelper.accessor("name", {
                header: "プラグイン",
                cell: (info) => (
                    <span className={nameStyle}>{info.getValue()}</span>
                ),
            }),
            columnHelper.accessor("currentVersion", {
                header: "現在のバージョン",
                // 1% + nowrap で、余白を貰わず中身の幅まで縮む
                meta: { width: "1%" },
                cell: (info) => (
                    <span
                        className={
                            info.row.original.isOutdated
                                ? outdatedVersionStyle
                                : versionStyle
                        }
                    >
                        {info.getValue()}
                    </span>
                ),
            }),
            columnHelper.accessor("latestVersion", {
                header: "最新バージョン",
                meta: { width: "1%" },
                cell: (info) => (
                    <span className={versionStyle}>{info.getValue()}</span>
                ),
            }),
            // 絞り込みの対象にするため、状態は独立した列として持たせる
            columnHelper.accessor(statusOf, {
                id: "status",
                header: "状態",
                meta: { width: "1%" },
                cell: (info) => <StatusBadge plugin={info.row.original} />,
            }),
            columnHelper.accessor((plugin) => plugin.description ?? "", {
                id: "description",
                header: "説明",
                enableSorting: false,
                cell: (info) =>
                    info.getValue() ? (
                        <span className={descriptionStyle}>
                            {info.getValue()}
                        </span>
                    ) : null,
            }),
        ],
        [],
    );

    return (
        <DataTable
            data={data}
            columns={columns}
            filters={FILTERS}
            emptyMessage="このサーバーに導入されているプラグインはありません"
        />
    );
}

/** 更新の要否を一目で分かるようにする。更新停止中は要否より優先して伝える */
function StatusBadge({ plugin }: { plugin: PluginItem }) {
    if (plugin.isLocked) {
        return (
            <Badge variant="subtle" size="sm">
                更新停止中
            </Badge>
        );
    }
    if (plugin.isOutdated) {
        return (
            <Badge variant="solid" size="sm">
                更新あり
            </Badge>
        );
    }
    return (
        <Badge variant="outline" size="sm">
            最新
        </Badge>
    );
}
