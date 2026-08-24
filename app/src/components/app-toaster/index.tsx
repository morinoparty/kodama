import { createToaster, Toaster } from "@morinoparty/chlorophyll-react";

// アプリ全体で 1 つだけ使う toaster。__root.tsx で <AppToaster /> を置き、
// 通知したい側は toaster.create({...}) を呼ぶ
export const toaster = createToaster();

/** toast を積むリージョン。アプリのルートに 1 つだけ置く */
export function AppToaster() {
    return <Toaster toaster={toaster} />;
}

/** 保存の成功を知らせる */
export const notifySaved = (description: string) =>
    toaster.create({ type: "success", title: "保存しました", description });

/** 保存の失敗を知らせる。原因を追えるようメッセージをそのまま出す */
export const notifyFailed = (error: unknown) =>
    toaster.create({
        type: "error",
        title: "保存できませんでした",
        description:
            error instanceof Error ? error.message : "原因不明のエラーです",
        closable: true,
    });
