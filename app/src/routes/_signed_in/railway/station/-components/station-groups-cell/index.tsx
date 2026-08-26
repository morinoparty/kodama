import { Spinner } from "@morinoparty/chlorophyll-react";
import { useMemo, useState } from "react";
import { css } from "styled-system/css";
import { notifyFailed, notifySaved } from "@/components/app-toaster";
import { Select, type SelectOption } from "@/components/select";
import {
    operatorOfGroup,
    sortByOperator,
} from "../../../-functions/group-operator";
import type { RailwayGroup } from "../../../-types";

// 保存中もセルの幅が変わらないよう、Select の隣にスピナーを添える
const rootStyle = css({
    display: "inline-flex",
    alignItems: "center",
    gap: "2",
});

// 乗換駅は 3 つ 4 つと所属することがあり、そのまま出すと 1 列で表が埋まる。
// 上限を決めてはみ出しは隠し、全体は一覧を開けば読める形にする
const selectStyle = css({ maxWidth: "64" });

export interface StationGroupsCellProps {
    /** 所属しているグループの UUID */
    readonly value: readonly string[];
    /** 選べるグループの一覧 */
    readonly groups: RailwayGroup[];
    /** 確定時に呼ばれる。失敗したら例外を投げる */
    readonly onSave: (groupIds: string[]) => Promise<void>;
}

/**
 * 駅が所属するグループをその場で選び直すセル。
 *
 * 1 つの駅が複数のグループに属しうる (乗換駅) ので複数選択にしている。
 * 保存中は選び直せなくしてスピナーを出し、二重送信を防ぐ。
 * 失敗したときは toast で理由を出す。
 */
export function StationGroupsCell({
    value,
    groups,
    onSave,
}: StationGroupsCellProps) {
    const [isSaving, setSaving] = useState(false);

    // 数が多いので、国鉄・私鉄の見出しでまとめて選びやすくする
    const options = useMemo<SelectOption[]>(
        () =>
            sortByOperator(groups, (group) => group.name).map((group) => ({
                label: group.name,
                value: group.id,
                group: operatorOfGroup(group.name),
            })),
        [groups],
    );

    const handleChange = async (groupIds: string[]) => {
        setSaving(true);
        try {
            await onSave(groupIds);
            notifySaved(
                groupIds.length === 0
                    ? "所属グループをなしにしました"
                    : `所属グループを ${groupIds.length} 件にしました`,
            );
        } catch (error) {
            notifyFailed(error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <span className={rootStyle}>
            <Select
                multiple
                label="所属グループ"
                placeholder="なし"
                value={value}
                options={options}
                disabled={isSaving}
                className={selectStyle}
                onValueChange={handleChange}
            />
            {isSaving ? <Spinner size="sm" aria-label="保存中" /> : null}
        </span>
    );
}
