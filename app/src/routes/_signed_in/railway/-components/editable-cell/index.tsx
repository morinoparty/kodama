import { Editable } from "@ark-ui/react/editable";
import { Spinner } from "@morinoparty/chlorophyll-react";
import { useState } from "react";
import { css } from "styled-system/css";
import { notifyFailed, notifySaved } from "@/components/app-toaster";

const rootStyle = css({
    display: "inline-flex",
    alignItems: "center",
    gap: "2",
});

// 押せることが分かるよう、hover で薄く枠を出す。
// 幅は文字数に追従させたいので ch を使う
const previewStyle = css({
    fontFamily: "mono",
    textStyle: "xs",
    color: "fg",
    px: "1.5",
    py: "0.5",
    borderRadius: "sm",
    borderWidth: "1px",
    borderStyle: "dashed",
    borderColor: "transparent",
    cursor: "text",
    _hover: { bg: "bg.muted", borderColor: "border.subtle" },
    _focusVisible: {
        outlineStyle: "solid",
        outlineWidth: "2px",
        outlineColor: "colorPalette.focus.ring",
        outlineOffset: "2px",
    },
});

const inputStyle = css({
    fontFamily: "mono",
    textStyle: "xs",
    color: "fg",
    bg: "bg",
    px: "1.5",
    py: "0.5",
    borderRadius: "sm",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "border.interactive",
    minWidth: "24",
    _focusVisible: {
        outlineStyle: "solid",
        outlineWidth: "2px",
        outlineColor: "colorPalette.focus.ring",
        outlineOffset: "1px",
    },
});

export interface EditableCellProps {
    /** 現在の値 */
    readonly value: string;
    /** 何を編集しているか (toast の文言と読み上げに使う。例: `駅の slug`) */
    readonly label: string;
    /** 確定時に呼ばれる。失敗したら例外を投げる */
    readonly onSave: (next: string) => Promise<void>;
}

/**
 * 表の中でその場で書き換えられるセル。
 *
 * 押すと入力に変わり、Enter で確定・Esc で取り消す。
 * 保存中は入力を閉じてスピナーを出し、二重送信を防ぐ。
 * 失敗したときは toast で理由を出し、表示は再読み込み後の値に戻る。
 */
export function EditableCell({ value, label, onSave }: EditableCellProps) {
    const [isSaving, setSaving] = useState(false);

    const handleSubmit = async (next: string) => {
        const trimmed = next.trim();
        // 変化なし・空文字は API を叩かずに黙って戻す
        if (trimmed === value || trimmed === "") {
            return;
        }

        setSaving(true);
        try {
            await onSave(trimmed);
            notifySaved(`${label}を ${trimmed} に変更しました`);
        } catch (error) {
            notifyFailed(error);
        } finally {
            setSaving(false);
        }
    };

    if (isSaving) {
        return (
            <span className={rootStyle}>
                <span className={previewStyle}>{value}</span>
                <Spinner size="sm" aria-label="保存中" />
            </span>
        );
    }

    return (
        <Editable.Root
            key={value}
            defaultValue={value}
            activationMode="click"
            submitMode="both"
            onValueCommit={(details) => handleSubmit(details.value)}
            className={rootStyle}
        >
            <Editable.Area>
                <Editable.Input className={inputStyle} aria-label={label} />
                <Editable.Preview className={previewStyle} />
            </Editable.Area>
        </Editable.Root>
    );
}
