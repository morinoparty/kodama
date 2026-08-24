import { createListCollection, Select } from "@ark-ui/react/select";
import { Portal, Spinner } from "@morinoparty/chlorophyll-react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { css } from "styled-system/css";
import { notifyFailed, notifySaved } from "@/components/app-toaster";
import type { RailwayGroup } from "../../-types";

// 未所属を表す選択肢の値。Select は文字列しか扱えないため、
// null の代わりに使う番兵を 1 か所で定義する
const NONE_VALUE = "__none__";

interface GroupOption {
    readonly label: string;
    readonly value: string;
}

const triggerStyle = css({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "2",
    minWidth: "36",
    px: "2",
    py: "1",
    borderRadius: "md",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "border.subtle",
    bg: "bg",
    textStyle: "sm",
    color: "fg",
    cursor: "pointer",
    _hover: { bg: "bg.muted" },
    _focusVisible: {
        outlineStyle: "solid",
        outlineWidth: "2px",
        outlineColor: "colorPalette.focus.ring",
        outlineOffset: "2px",
    },
    "& :where(svg)": { width: "3.5", height: "3.5", flexShrink: "0" },
});

const placeholderStyle = css({ color: "fg.subtle" });

const contentStyle = css({
    display: "flex",
    flexDirection: "column",
    gap: "0.5",
    minWidth: "40",
    maxHeight: "72",
    overflowY: "auto",
    p: "1",
    borderRadius: "md",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "border.subtle",
    bg: "bg.panel",
    boxShadow: "md",
    zIndex: "dropdown",
});

const itemStyle = css({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "2",
    px: "2",
    py: "1.5",
    borderRadius: "sm",
    textStyle: "sm",
    color: "fg",
    cursor: "pointer",
    "&[data-highlighted]": { bg: "bg.muted" },
    "&[data-state='checked']": {
        bg: "colorPalette.bg.subtle",
        color: "colorPalette.fg",
    },
    "& :where(svg)": { width: "3.5", height: "3.5", flexShrink: "0" },
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
 * 「なし」を選ぶと未所属に戻す。保存中はスピナーを出して二重送信を防ぎ、
 * 失敗したときは toast で理由を出す。
 */
export function GroupSelectCell({
    value,
    groups,
    onSave,
}: GroupSelectCellProps) {
    const [isSaving, setSaving] = useState(false);

    // Select には「なし」を先頭に足した一覧を渡す。
    // 描画でも同じ配列を使いたいので、items と collection を別々に持つ
    const items = useMemo<GroupOption[]>(
        () => [
            { label: "なし", value: NONE_VALUE },
            ...groups.map((group) => ({ label: group.name, value: group.id })),
        ],
        [groups],
    );
    const collection = useMemo(() => createListCollection({ items }), [items]);

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

    if (isSaving) {
        return <Spinner size="sm" aria-label="保存中" />;
    }

    return (
        <Select.Root
            collection={collection}
            value={[value ?? NONE_VALUE]}
            onValueChange={(details) => handleChange(details.value[0])}
            positioning={{ sameWidth: false }}
        >
            <Select.Control>
                <Select.Trigger className={triggerStyle}>
                    <Select.ValueText
                        placeholder="なし"
                        className={
                            value === null ? placeholderStyle : undefined
                        }
                    />
                    <ChevronsUpDownIcon aria-hidden="true" />
                </Select.Trigger>
            </Select.Control>
            {/* 表は overflow-x: auto のコンテナに入っているので、
                Portal を通さないとメニューが切れてしまう */}
            <Portal>
                <Select.Positioner>
                    <Select.Content className={contentStyle}>
                        {items.map((item) => (
                            <Select.Item
                                key={item.value}
                                item={item}
                                className={itemStyle}
                            >
                                <Select.ItemText>{item.label}</Select.ItemText>
                                <Select.ItemIndicator>
                                    <CheckIcon aria-hidden="true" />
                                </Select.ItemIndicator>
                            </Select.Item>
                        ))}
                    </Select.Content>
                </Select.Positioner>
            </Portal>
        </Select.Root>
    );
}
