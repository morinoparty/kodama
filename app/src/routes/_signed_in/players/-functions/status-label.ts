import type { RegisterStatus } from "../-types";

/** Badge の色分け (Chlorophyll の Badge の status) */
type BadgeTone = "success" | "warning" | "error" | "info";

interface StatusLabel {
    readonly label: string;
    readonly description: string;
    readonly tone: BadgeTone;
}

/** 登録結果の status を、画面に出す日本語と色に対応させる */
export const STATUS_LABELS: Readonly<Record<RegisterStatus, StatusLabel>> = {
    registered: {
        label: "登録",
        description: "新しく登録し、プロフィールも取得しました",
        tone: "success",
    },
    updated: {
        label: "更新",
        description:
            "登録済みです。プロフィールを取り直したか、名前を更新しました",
        tone: "success",
    },
    already_registered: {
        label: "登録済み",
        description: "すでに登録されています (同じ入力の重複を含む)",
        tone: "info",
    },
    pending: {
        label: "取得待ち",
        description: "登録しました。プロフィールはあとで取得されます",
        tone: "warning",
    },
    not_found: {
        label: "存在しない",
        description: "Mojang に存在しない UUID なので登録しませんでした",
        tone: "error",
    },
    error: {
        label: "失敗",
        description: "mc-api へのリクエストに失敗しました",
        tone: "error",
    },
};
