import { Badge } from "@morinoparty/chlorophyll-react";
import { createColumnHelper } from "@tanstack/react-table";
import { useMemo } from "react";
import { css } from "styled-system/css";
import { DataTable, type DataTableFilter } from "@/components/data-table";
import type { PluginRow } from "../../-types";

// プラグイン名は一覧の主役なので少し強く見せる
const nameStyle = css({ fontWeight: "medium", color: "fg" });

// バージョンは桁を見比べるので等幅で出す
const versionStyle = css({ fontFamily: "mono", textStyle: "sm" });

// 最新から遅れているバージョンは、並んだときに目で追えるよう色を落とす
const outdatedVersionStyle = css({
    fontFamily: "mono",
    textStyle: "sm",
    color: "fg.muted",
});

// 更新チェックが取れていないバージョンは、確かめた値と同じ顔で出さない。
// 理由は title に入れるので、読めることが分かるようカーソルも変える
const unverifiedVersionStyle = css({
    fontFamily: "mono",
    textStyle: "sm",
    color: "fg.subtle",
    cursor: "help",
});

// 値が無いことを表すダッシュ。等幅の桁と揃わないので別に用意する
const unknownStyle = css({ textStyle: "sm", color: "fg.subtle" });

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
    { columnId: "status", label: "状態" },
];

/**
 * 更新の要否・更新停止・管理外を、1 つの状態としてまとめて見せる。
 *
 * 「管理外」は厳密には「MPM の一覧に載っていない」という意味。
 * `mpm.json` に登録されていない jar のほかに、登録はされているがメタデータが
 * 壊れているものも MPM の一覧から外れるため、ここに現れうる。
 *
 * 「更新あり」と言い切るのは更新チェックが取れたときだけにする。MPM の記録値は
 * Fixed 指定 (pin / rollback での固定) を反映しないため、そのまま信じると
 * ありもしないダウングレードを勧めてしまう
 */
const statusOf = (plugin: PluginRow): string => {
    if (!plugin.isManaged) return "管理外";
    if (plugin.currentVersion === null) return "未導入";
    if (plugin.isLocked) return "更新停止中";
    if (plugin.latestCheck === "failed") return "確認できません";
    if (plugin.latestCheck !== "checked") return "未確認";
    return plugin.isOutdated ? "更新あり" : "最新";
};

/** 更新チェックが取れていない最新バージョンに添える、その理由 */
const unverifiedReasonOf = (plugin: PluginRow): string =>
    plugin.latestCheck === "failed"
        ? `更新チェックに失敗したため、MPM が最後に記録した値です (${plugin.checkError ?? "理由不明"})`
        : "更新チェックを取得できなかったため、MPM が最後に記録した値です";

const columnHelper = createColumnHelper<PluginRow>();

export interface PluginsTableProps {
    readonly data: PluginRow[];
}

/**
 * プラグイン一覧のテーブル。
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
                cell: (info) => {
                    const version = info.getValue();
                    if (version === null) {
                        return <Unknown label="導入されていません" />;
                    }
                    return (
                        <span
                            className={
                                info.row.original.isOutdated
                                    ? outdatedVersionStyle
                                    : versionStyle
                            }
                        >
                            {version}
                        </span>
                    );
                },
            }),
            columnHelper.accessor("latestVersion", {
                header: "最新バージョン",
                meta: { width: "1%" },
                cell: (info) => {
                    const plugin = info.row.original;
                    // 管理外のプラグインは配布元が分からないので最新も分からない
                    if (!plugin.isManaged) {
                        return <Unknown label="MPM の管理下にないため不明" />;
                    }
                    const version = info.getValue();
                    if (version === undefined) {
                        return <Unknown label="MPM に記録がないため不明" />;
                    }
                    if (plugin.latestCheck === "checked") {
                        return <span className={versionStyle}>{version}</span>;
                    }
                    // 確かめられていない値なので、記録値であることを添えて控えめに出す
                    const reason = unverifiedReasonOf(plugin);
                    return (
                        <span className={unverifiedVersionStyle} title={reason}>
                            {version}
                            <span className={css({ srOnly: true })}>
                                {reason}
                            </span>
                        </span>
                    );
                },
            }),
            // 絞り込みの対象にするため、状態は独立した列として持たせる
            columnHelper.accessor(statusOf, {
                id: "status",
                header: "状態",
                meta: { width: "1%" },
                cell: (info) => <StatusBadge label={info.getValue()} />,
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

/** 値が分からないセル。なぜ分からないのかは title で補う */
function Unknown({ label }: { label: string }) {
    return (
        <span className={unknownStyle} title={label}>
            —<span className={css({ srOnly: true })}>{label}</span>
        </span>
    );
}

// 状態ごとの見せ方。更新が要るものだけを強く出し、それ以外は控えめにする
const BADGE_VARIANTS = {
    更新あり: "solid",
    管理外: "subtle",
    未導入: "subtle",
    更新停止中: "subtle",
    確認できません: "subtle",
    未確認: "subtle",
    最新: "outline",
} as const satisfies Record<string, "solid" | "subtle" | "outline">;

function StatusBadge({ label }: { label: string }) {
    const variant =
        BADGE_VARIANTS[label as keyof typeof BADGE_VARIANTS] ?? "outline";

    return (
        <Badge variant={variant} size="sm">
            {label}
        </Badge>
    );
}
