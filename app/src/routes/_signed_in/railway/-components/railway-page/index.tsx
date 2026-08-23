import type { ReactNode } from "react";
import { css } from "styled-system/css";

const pageStyle = css({
    display: "flex",
    flexDirection: "column",
    gap: "6",
    maxWidth: "7xl",
    mx: "auto",
    px: { base: "4", sm: "6" },
    py: { base: "8", sm: "12" },
});

const headerStyle = css({
    display: "flex",
    flexDirection: "column",
    gap: "1",
});

const headingStyle = css({
    textStyle: "2xl",
    fontWeight: "bold",
    color: "fg",
});

const leadStyle = css({
    textStyle: "sm",
    color: "fg.muted",
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

const errorTextStyle = css({
    textStyle: "sm",
    color: "fg.muted",
});

const errorDetailStyle = css({
    textStyle: "xs",
    color: "fg.subtle",
    fontFamily: "mono",
    bg: "bg.muted",
    p: "3",
    borderRadius: "md",
    whiteSpace: "pre-wrap",
    wordBreak: "break-all",
});

export interface RailwayPageProps {
    readonly title: string;
    readonly description: string;
    readonly children: ReactNode;
}

export interface RailwayPageLoadErrorProps {
    /** 「〜の取得に失敗しました。」の主語 (例: `駅情報`) */
    readonly resourceLabel: string;
    /** loader が投げたエラー。原因を追えるようメッセージを添える */
    readonly error: Error;
}

/**
 * 鉄道セクションの各ページに共通する見出しと余白。
 *
 * 読み込みに失敗したときも見出しはそのまま残したいので、
 * 失敗時の中身は `RailwayPage.LoadError` として同じ枠の中に描く。
 */
export function RailwayPage({
    title,
    description,
    children,
}: RailwayPageProps) {
    return (
        <div className={pageStyle}>
            <div className={headerStyle}>
                <h1 className={headingStyle}>{title}</h1>
                <p className={leadStyle}>{description}</p>
            </div>
            {children}
        </div>
    );
}

function RailwayPageLoadError({
    resourceLabel,
    error,
}: RailwayPageLoadErrorProps) {
    return (
        <section className={cardStyle}>
            <p className={errorTextStyle}>
                {resourceLabel}
                の取得に失敗しました。時間をおいて再読み込みしてください。
            </p>
            {error.message ? (
                <p className={errorDetailStyle}>{error.message}</p>
            ) : null}
        </section>
    );
}

RailwayPage.LoadError = RailwayPageLoadError;
