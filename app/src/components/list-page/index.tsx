import type { ReactNode } from "react";
import { css } from "styled-system/css";

// 一覧はどれも列が多いので、幅の上限は設けずに画面いっぱいまで使う。
// 読み物の画面 (ホームなど) とは違い、1 行を折り返さずに見せたい
const pageStyle = css({
    display: "flex",
    flexDirection: "column",
    gap: "6",
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
    bg: "colorPalette.bg.subtle",
    p: "3",
    borderRadius: "md",
    whiteSpace: "pre-wrap",
    wordBreak: "break-all",
});

export interface ListPageProps {
    readonly title: string;
    readonly description: string;
    readonly children: ReactNode;
}

export interface ListPageLoadErrorProps {
    /** 「〜の取得に失敗しました。」の主語 (例: `駅情報`) */
    readonly resourceLabel: string;
    /** loader が投げたエラー。原因を追えるようメッセージを添える */
    readonly error: Error;
}

/**
 * 一覧ページに共通する見出しと余白。鉄道・プラグインなど、
 * 表を 1 つ置くだけのページはこの枠に載せる。
 *
 * 読み込みに失敗したときも見出しはそのまま残したいので、
 * 失敗時の中身は `ListPage.LoadError` として同じ枠の中に描く。
 */
export function ListPage({ title, description, children }: ListPageProps) {
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

function ListPageLoadError({ resourceLabel, error }: ListPageLoadErrorProps) {
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

ListPage.LoadError = ListPageLoadError;
