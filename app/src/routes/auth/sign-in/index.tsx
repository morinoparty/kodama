import { Button } from "@morinoparty/chlorophyll-react";
import { createFileRoute } from "@tanstack/react-router";
import { SproutIcon } from "lucide-react";
import { css } from "styled-system/css";
import { handleLogin } from "./-functions/handle-login";

export const Route = createFileRoute("/auth/sign-in/")({
    component: SignInPage,
});

// サイドバーの外側にある独立したページなので、単体で成立するよう画面中央に置く
const pageStyle = css({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100dvh",
    px: "4",
    py: "12",
});

const cardStyle = css({
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "4",
    width: "full",
    maxWidth: "md",
    px: { base: "6", sm: "8" },
    py: { base: "8", sm: "10" },
    borderRadius: "2xl",
    bg: "bg.panel",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "border.subtle",
    boxShadow: "lg",
});

const markStyle = css({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "12",
    height: "12",
    borderRadius: "xl",
    bg: "colorPalette.solid",
    color: "colorPalette.contrast",
});

const kickerStyle = css({
    textStyle: "xs",
    fontWeight: "semibold",
    color: "fg.subtle",
});

const titleStyle = css({
    textStyle: "2xl",
    fontWeight: "bold",
    color: "fg",
});

const leadStyle = css({
    textStyle: "sm",
    color: "fg.muted",
});

const buttonStyle = css({ width: "full", mt: "2" });

function SignInPage() {
    return (
        <main className={pageStyle}>
            <section className={cardStyle}>
                <span className={markStyle} aria-hidden="true">
                    <SproutIcon size={24} />
                </span>
                <p className={kickerStyle}>もりのパーティ 運営ツール</p>
                <h1 className={titleStyle}>Kodama にログイン</h1>
                <p className={leadStyle}>
                    サーバー管理機能を利用するには、MineAuth
                    アカウントでのログインが必要です。
                </p>
                <Button
                    type="button"
                    intent="primary"
                    onClick={handleLogin}
                    className={buttonStyle}
                >
                    MineAuth でログイン
                </Button>
            </section>
        </main>
    );
}
