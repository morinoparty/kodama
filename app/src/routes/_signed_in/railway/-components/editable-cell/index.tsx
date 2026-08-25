import { Editable, Spinner } from "@morinoparty/chlorophyll-react";
import { useState } from "react";
import { notifyFailed, notifySaved } from "@/components/app-toaster";

export interface EditableCellProps {
    /** 現在の値 */
    readonly value: string;
    /** 何を編集しているか (toast の文言と読み上げに使う。例: `駅の slug`) */
    readonly label: string;
    /** slug や ID のように等幅で読ませたい値なら true */
    readonly mono?: boolean;
    /** 確定時に呼ばれる。失敗したら例外を投げる */
    readonly onSave: (next: string) => Promise<void>;
}

/**
 * 表の中でその場で書き換えられるセル。
 *
 * 押すと入力に変わり、Enter で確定・Esc で取り消す。
 * 保存中は編集に入れなくしてスピナーを出し、二重送信を防ぐ。
 * 失敗したときは toast で理由を出し、表示は編集前の値に戻る。
 */
export function EditableCell({
    value,
    label,
    mono = false,
    onSave,
}: EditableCellProps) {
    const [isSaving, setSaving] = useState(false);
    // Editable は defaultValue を初回マウントのときしか読まない。
    // 編集を取り消したいときは key を変えて描き直す
    const [revision, setRevision] = useState(0);
    const resetDraft = () => setRevision((current) => current + 1);

    const handleSubmit = async (next: string) => {
        const trimmed = next.trim();
        // 変化なし・空文字は API を叩かず、黙って元の値に戻す
        if (trimmed === value || trimmed === "") {
            resetDraft();
            return;
        }

        setSaving(true);
        try {
            await onSave(trimmed);
            notifySaved(`${label}を ${trimmed} に変更しました`);
        } catch (error) {
            notifyFailed(error);
            resetDraft();
        } finally {
            setSaving(false);
        }
    };

    return (
        <Editable.Root
            key={`${value}-${revision}`}
            defaultValue={value}
            activationMode="click"
            submitMode="both"
            mono={mono}
            size="sm"
            // 保存中は編集に入れないようにして二重送信を防ぐ
            disabled={isSaving}
            onValueCommit={(details) => handleSubmit(details.value)}
        >
            <Editable.Area>
                <Editable.Input aria-label={label} />
                <Editable.Preview />
            </Editable.Area>
            {isSaving ? <Spinner size="sm" aria-label="保存中" /> : null}
        </Editable.Root>
    );
}
