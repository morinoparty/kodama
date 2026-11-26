import { Button, Checkbox, Field } from "@morinoparty/chlorophyll-react";
import { UserPlusIcon, UsersIcon } from "lucide-react";
import { type FormEvent, useState } from "react";
import { css } from "styled-system/css";
import {
    MAX_BATCH_UUIDS,
    parseBatchText,
    uuidSchema,
} from "../../-functions/player-input";

export interface RegisterFormProps {
    /** 1 人を登録する。uuid は正規化済み */
    readonly onRegisterOne: (uuid: string) => Promise<void>;
    /** まとめて登録する。uuids は正規化済みで 1〜100 件 */
    readonly onRegisterBatch: (
        uuids: string[],
        fetchProfiles: boolean,
    ) => Promise<void>;
}

// 1 人 / 一括の 2 つの入力欄を、広い画面では横に、狭い画面では縦に並べる
const gridStyle = css({
    display: "grid",
    gridTemplateColumns: { base: "1fr", lg: "1fr 1fr" },
    gap: "4",
    alignItems: "start",
});

const cardStyle = css({
    display: "flex",
    flexDirection: "column",
    gap: "4",
    p: { base: "5", sm: "6" },
    borderRadius: "xl",
    bg: "bg.panel",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "border.subtle",
    boxShadow: "sm",
});

const cardTitleStyle = css({
    display: "flex",
    alignItems: "center",
    gap: "2",
    textStyle: "md",
    fontWeight: "bold",
    color: "fg",
    "& :where(svg)": { width: "4", height: "4", flexShrink: "0" },
});

const uuidInputStyle = css({ fontFamily: "mono" });

const textareaStyle = css({ fontFamily: "mono", minHeight: "40" });

const footerStyle = css({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "3",
});

const countStyle = css({ textStyle: "xs", color: "fg.muted" });

/**
 * mc-api へプレイヤーを登録するための入力欄 (1 人 / 一括)。
 *
 * 入力の検証 (UUID の形式・件数の上限) はここでも行うが、表示のためだけである。
 * 送ったあとの検証はサーバー関数の Zod スキーマが改めて行う
 */
export function RegisterForm({
    onRegisterOne,
    onRegisterBatch,
}: RegisterFormProps) {
    return (
        <div className={gridStyle}>
            <SingleRegisterCard onRegister={onRegisterOne} />
            <BatchRegisterCard onRegister={onRegisterBatch} />
        </div>
    );
}

function SingleRegisterCard({
    onRegister,
}: {
    readonly onRegister: RegisterFormProps["onRegisterOne"];
}) {
    const [value, setValue] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const result = uuidSchema.safeParse(value);
        if (!result.success) {
            setError(
                result.error.issues[0]?.message ?? "UUID の形式ではありません",
            );
            return;
        }

        setError(null);
        setSubmitting(true);
        try {
            await onRegister(result.data);
            setValue("");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form className={cardStyle} onSubmit={handleSubmit} noValidate>
            <h2 className={cardTitleStyle}>
                <UserPlusIcon aria-hidden />1 人を登録
            </h2>
            <Field invalid={error !== null} required>
                <Field.Label>
                    UUID
                    <Field.RequiredIndicator />
                </Field.Label>
                <Field.Input
                    className={uuidInputStyle}
                    value={value}
                    onChange={(event) => {
                        setValue(event.target.value);
                        setError(null);
                    }}
                    placeholder="f8b761ec-4a54-48eb-a040-c5604042bcc9"
                    autoComplete="off"
                    spellCheck={false}
                />
                <Field.HelperText>
                    ハイフンの有無や大文字・小文字は問いません。MCID
                    からは登録できません。
                </Field.HelperText>
                <Field.ErrorText>{error}</Field.ErrorText>
            </Field>
            <div className={footerStyle}>
                <span />
                <Button
                    type="submit"
                    intent="primary"
                    size="md"
                    disabled={submitting}
                >
                    {submitting ? "登録中…" : "登録する"}
                </Button>
            </div>
        </form>
    );
}

function BatchRegisterCard({
    onRegister,
}: {
    readonly onRegister: RegisterFormProps["onRegisterBatch"];
}) {
    const [text, setText] = useState("");
    const [fetchProfiles, setFetchProfiles] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // 入力のたびに件数を数え直し、上限を超えたことを送る前に分かるようにする
    const parsed = parseBatchText(text);
    const total = parsed.uuids.length + parsed.invalid.length;

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (parsed.invalid.length > 0) {
            setError(
                `UUID の形式ではない行があります: ${parsed.invalid.slice(0, 5).join(", ")}${parsed.invalid.length > 5 ? " ほか" : ""}`,
            );
            return;
        }
        if (parsed.uuids.length === 0) {
            setError("UUID を 1 件以上入力してください");
            return;
        }
        if (parsed.uuids.length > MAX_BATCH_UUIDS) {
            setError(`一度に登録できるのは ${MAX_BATCH_UUIDS} 件までです`);
            return;
        }

        setError(null);
        setSubmitting(true);
        try {
            await onRegister(parsed.uuids, fetchProfiles);
            setText("");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form className={cardStyle} onSubmit={handleSubmit} noValidate>
            <h2 className={cardTitleStyle}>
                <UsersIcon aria-hidden />
                まとめて登録
            </h2>
            <Field invalid={error !== null} required>
                <Field.Label>
                    UUID の一覧
                    <Field.RequiredIndicator />
                </Field.Label>
                <Field.Textarea
                    className={textareaStyle}
                    value={text}
                    onChange={(event) => {
                        setText(event.target.value);
                        setError(null);
                    }}
                    placeholder={
                        "f8b761ec-4a54-48eb-a040-c5604042bcc9\n069a79f444e94726a5befca90e38aaf5"
                    }
                    autoComplete="off"
                    spellCheck={false}
                />
                <Field.HelperText>
                    1 行に 1 件ずつ、最大 {MAX_BATCH_UUIDS}{" "}
                    件まで。改行・カンマ・空白で区切れます。
                </Field.HelperText>
                <Field.ErrorText>{error}</Field.ErrorText>
            </Field>
            <Checkbox
                checked={fetchProfiles}
                onCheckedChange={(details) =>
                    setFetchProfiles(details.checked === true)
                }
            >
                <Checkbox.Control />
                <Checkbox.Label>
                    新規の先頭 10 件はその場でプロフィールを取得する
                </Checkbox.Label>
                <Checkbox.HiddenInput />
            </Checkbox>
            <div className={footerStyle}>
                <span className={countStyle}>
                    {total} / {MAX_BATCH_UUIDS} 件
                    {parsed.invalid.length > 0
                        ? ` (形式エラー ${parsed.invalid.length} 件)`
                        : ""}
                </span>
                <Button
                    type="submit"
                    intent="primary"
                    size="md"
                    disabled={submitting}
                >
                    {submitting ? "登録中…" : "まとめて登録する"}
                </Button>
            </div>
        </form>
    );
}
