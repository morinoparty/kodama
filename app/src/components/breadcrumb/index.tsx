import { Link, type LinkProps } from "@tanstack/react-router";
import { ChevronRightIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { css, cx } from "styled-system/css";

// パンくずは Chlorophyll にも Ark UI にも該当するコンポーネントが無いため、
// セマンティックな HTML (nav > ol > li) に Panda のトークンでスタイルを当てて自作する。
// Chlorophyll 側への追加は morinoparty/Chlorophyll#76 で提案している。

// パンくずは折り返さず 1 行に保つ。折り返すと高さが決まっているヘッダーから
// はみ出してしまうため、width: max-content で内容分の幅を持たせ、
// 入り切らない分は外側のスクロールコンテナに吸収してもらう
const listStyle = css({
    display: "flex",
    alignItems: "center",
    flexWrap: "nowrap",
    width: "max-content",
    gap: "1.5",
    listStyle: "none",
    margin: "0",
    padding: "0",
    textStyle: "sm",
    color: "fg.muted",
});

const itemStyle = css({
    display: "inline-flex",
    alignItems: "center",
    gap: "1",
    minWidth: "0",
});

const linkStyle = css({
    borderRadius: "sm",
    color: "fg.muted",
    textDecoration: "none",
    truncate: true,
    transitionProperty: "color",
    transitionDuration: "fast",
    transitionTimingFunction: "easeInOut",
    _hover: { color: "fg" },
    // outline: "none" + ringWidth の組み合わせだと outline-style が none のまま
    // 残り、フォーカスリングが一切描かれない。longhand で style まで指定する
    _focusVisible: {
        outlineStyle: "solid",
        outlineWidth: "2px",
        outlineColor: "colorPalette.focus.ring",
        outlineOffset: "2px",
    },
});

// 押せない段なので、リンクと違って hover の反応は付けない
const textStyle = css({
    color: "fg.muted",
    truncate: true,
});

const pageStyle = css({
    color: "fg",
    fontWeight: "medium",
    truncate: true,
});

const separatorStyle = css({
    display: "inline-flex",
    alignItems: "center",
    flexShrink: "0",
    color: "fg.subtle",
    "& :where(svg)": {
        width: "3.5",
        height: "3.5",
    },
});

/** パンくず全体を包む landmark。ラベルは読み上げ用に日本語で持たせる */
const Root = ({ className, ...props }: ComponentProps<"nav">) => (
    <nav aria-label="パンくずリスト" className={className} {...props} />
);

const List = ({ className, ...props }: ComponentProps<"ol">) => (
    <ol className={cx(listStyle, className)} {...props} />
);

const Item = ({ className, ...props }: ComponentProps<"li">) => (
    <li className={cx(itemStyle, className)} {...props} />
);

/**
 * 祖先の段。SPA 内の遷移なので TanStack Router の Link を使う。
 *
 * Link は「現在地の前方一致」で active と判定すると aria-current="page" を
 * 強制的に付ける。パンくずの祖先は必ず現在地の前方一致になるため、
 * そのままだと段のいくつもが「現在のページ」を名乗ってしまう。
 * exact 一致に絞ることで、現在地を表すのは末尾の Page だけになる。
 */
const BreadcrumbLink = ({
    className,
    ...props
}: LinkProps & { className?: string }) => (
    <Link
        activeOptions={{ exact: true }}
        className={cx(linkStyle, className)}
        {...props}
    />
);

/** 現在地の段。リンクにはせず aria-current で現在地であることを伝える */
const Page = ({ className, ...props }: ComponentProps<"span">) => (
    <span aria-current="page" className={cx(pageStyle, className)} {...props} />
);

/**
 * リンク先を持たない途中の段。現在地ではないので aria-current は付けない。
 * サイドバーの区分名のように、画面を持たない階層を表すときに使う
 */
const Text = ({ className, ...props }: ComponentProps<"span">) => (
    <span className={cx(textStyle, className)} {...props} />
);

/**
 * 段の区切り。読み上げでは不要なので aria-hidden にし、
 * li に role="presentation" を付けてリストの項目数を狂わせないようにする
 */
const Separator = ({
    children,
    className,
    ...props
}: ComponentProps<"li"> & { children?: ReactNode }) => (
    <li
        role="presentation"
        aria-hidden="true"
        className={cx(separatorStyle, className)}
        {...props}
    >
        {children ?? <ChevronRightIcon />}
    </li>
);

/**
 * パンくずリスト。Compound Component として組み合わせて使う。
 *
 * ```tsx
 * <Breadcrumb.Root>
 *   <Breadcrumb.List>
 *     <Breadcrumb.Item>
 *       <Breadcrumb.Link to="/">ホーム</Breadcrumb.Link>
 *     </Breadcrumb.Item>
 *     <Breadcrumb.Separator />
 *     <Breadcrumb.Item>
 *       <Breadcrumb.Page>プラグイン</Breadcrumb.Page>
 *     </Breadcrumb.Item>
 *   </Breadcrumb.List>
 * </Breadcrumb.Root>
 * ```
 */
export const Breadcrumb = {
    Root,
    List,
    Item,
    Link: BreadcrumbLink,
    Page,
    Text,
    Separator,
};
