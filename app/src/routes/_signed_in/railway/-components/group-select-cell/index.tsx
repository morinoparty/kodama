import { Spinner } from "@morinoparty/chlorophyll-react";
import { useMemo, useState } from "react";
import { css } from "styled-system/css";
import { notifyFailed, notifySaved } from "@/components/app-toaster";
import { Select, type SelectOption } from "@/components/select";
import type { RailwayGroup } from "../../-types";

// 未所属を表す選択肢の値。Select は文字列しか扱えないため、
// null の代わりに使う番兵を 1 か所で定義する
const NONE_VALUE = "__none__";

// 保存中もセルの幅が変わらないよう、Select の隣にスピナーを添える
const rootStyle = css({
    display: "inline-flex",
    alignItems: "center",
    gap: "2",
});

export interface GroupSelectCellProps {
    /** 現在所属しているグループの UUID。未所属なら null */
    readonly value: string | null;
    /** 選べるグループの一覧 */
    readonly groups: RailwayGroup[];
    /** 確定時に呼ばれる。未所属にするときは null が渡る。失敗したら例外を投げる */
    readonly onSave: (groupId: string | null) => Promise<void>;
}

/**
 * 路線の所属グループをその場で選び直すセル。
 *
 * 「なし」を選ぶと未所属に戻す。保存中は選び直せなくしてスピナーを出し、
 * 二重送信を防ぐ。失敗したときは toast で理由を出す。
 */
export function GroupSelectCell({
    value,
    groups,
    onSave,
}: GroupSelectCellProps) {
    const [isSaving, setSaving] = useState(false);

    // 「なし」を先頭に足した選択肢
    const options = useMemo<SelectOption[]>(
        () => [
            { label: "なし", value: NONE_VALUE },
            ...groups.map((group) => ({ label: group.name, value: group.id })),
        ],
        [groups],
    );

    const handleChange = async (next: string) => {
        const groupId = next === NONE_VALUE ? null : next;
        if (groupId === value) {
            return;
        }

        setSaving(true);
        try {
            await onSave(groupId);
            const label =
                groups.find((group) => group.id === groupId)?.name ?? "なし";
            notifySaved(`所属グループを ${label} に変更しました`);
        } catch (error) {
            notifyFailed(error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <span className={rootStyle}>
            <Select
                label="所属グループ"
                value={value ?? NONE_VALUE}
                options={options}
                disabled={isSaving}
                onValueChange={handleChange}
            />
            {isSaving ? <Spinner size="sm" aria-label="保存中" /> : null}
        </span>
    );
}
