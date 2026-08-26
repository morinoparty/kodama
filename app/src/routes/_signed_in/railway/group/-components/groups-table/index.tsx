import { Link, useRouter } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import { ChevronRightIcon } from "lucide-react";
import { useMemo } from "react";
import { css } from "styled-system/css";
import { DataTable } from "@/components/data-table";
import { ColorSwatch } from "../../../-components/color-swatch";
import { EditableCell } from "../../../-components/editable-cell";
import type { RailwayGroup } from "../../../-types";
import {
    updateGroupName,
    updateGroupNumberingPrefix,
    updateGroupNumberingStart,
    updateGroupSlug,
} from "../../-api/get-groups";

// 名前は一覧の主役なので少し強く見せる。Editable の preview / input は
// 書体を継承するので、外側に指定すれば表示と編集で見え方が揃う
const nameStyle = css({ fontWeight: "medium", color: "fg" });

// 詳細ページへのリンク。グループ名は編集セルなのでリンクにできないため、
// 行の末尾に専用の列を置いている
const detailLinkStyle = css({
    display: "inline-flex",
    alignItems: "center",
    gap: "1",
    textStyle: "sm",
    color: "colorPalette.fg",
    borderRadius: "sm",
    _hover: { textDecoration: "underline" },
    _focusVisible: {
        outlineStyle: "solid",
        outlineWidth: "2px",
        outlineColor: "colorPalette.focus.ring",
        outlineOffset: "2px",
    },
    "& :where(svg)": { width: "3.5", height: "3.5", flexShrink: "0" },
});

const columnHelper = createColumnHelper<RailwayGroup>();

/**
 * AdvanceRailway のグループ一覧テーブル。
 * グループ名・slug と、ナンバリングの接頭辞・開始番号は表の中でそのまま書き換えられる。
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
                cell: (info) => (
                    // 空にするとナンバリングなしに戻る。API 側も unset に対応している
                    <EditableCell
                        value={info.getValue() ?? ""}
                        label="ナンバリング接頭辞"
                        mono
                        allowEmpty
                        placeholder="なし"
                        onSave={async (prefix) => {
                            await updateGroupNumberingPrefix({
                                data: {
                                    id: info.row.original.id,
                                    prefix: prefix === "" ? null : prefix,
                                },
                            });
                            await router.invalidate();
                        }}
                    />
                ),
            }),
            columnHelper.accessor("numberingStart", {
                header: "開始番号",
                cell: (info) => (
                    <EditableCell
                        value={String(info.getValue())}
                        label="ナンバリング開始番号"
                        mono
                        onSave={async (next) => {
                            // 接頭辞と違い unset が無いので、未設定に戻す口は用意しない。
                            // 整数以外は送らずここで弾く
                            const start = Number(next);
                            if (!Number.isInteger(start)) {
                                throw new Error(
                                    "開始番号は整数で入力してください",
                                );
                            }
                            await updateGroupNumberingStart({
                                data: { id: info.row.original.id, start },
                            });
                            await router.invalidate();
                        }}
                    />
                ),
            }),
            // 駅の並び (= ナンバリング順) は詳細ページで編集する。
            // 並べ替えの対象にしても意味がないので外しておく
            columnHelper.display({
                id: "stations",
                header: "駅の並び",
                enableSorting: false,
                meta: { width: "1%" },
                cell: (info) => (
                    <Link
                        to="/railway/group/$id"
                        params={{ id: info.row.original.id }}
                        className={detailLinkStyle}
                    >
                        駅の並び
                        <ChevronRightIcon aria-hidden="true" />
                    </Link>
                ),
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
