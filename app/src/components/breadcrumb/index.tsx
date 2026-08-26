import { Breadcrumb as ChlorophyllBreadcrumb } from "@morinoparty/chlorophyll-react";
import { Link, type LinkProps } from "@tanstack/react-router";
import type { ComponentProps } from "react";
import { css, cx } from "styled-system/css";

// Chlorophyll の Breadcrumb はルーター非依存なので、TanStack Router の Link を
// 差し込む部分と、このアプリ特有の見た目 (1 行に保つ / リンクを持たない段) だけを
// ここで足している

// パンくずは折り返さず 1 行に保つ。折り返すと高さが決まっているヘッダーから
// はみ出してしまうため、width: max-content で内容分の幅を持たせ、
// 入り切らない分は外側のスクロールコンテナに吸収してもらう
const listStyle = css({
    flexWrap: "nowrap",
    width: "max-content",
});

const truncateStyle = css({ truncate: true });

// 押せない段なので、リンクと違って hover の反応は付けない
const textStyle = css({
    color: "fg.muted",
    truncate: true,
});

/** パンくず全体を包む landmark。ラベルは読み上げ用に日本語で持たせる */
const Root = (props: ComponentProps<typeof ChlorophyllBreadcrumb.Root>) => (
    <ChlorophyllBreadcrumb.Root aria-label="パンくずリスト" {...props} />
);

const List = ({
    className,
    ...props
}: ComponentProps<typeof ChlorophyllBreadcrumb.List>) => (
    <ChlorophyllBreadcrumb.List
        className={cx(listStyle, className)}
        {...props}
    />
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
    <ChlorophyllBreadcrumb.Link asChild>
        <Link
            activeOptions={{ exact: true }}
            className={cx(truncateStyle, className)}
            {...props}
        />
    </ChlorophyllBreadcrumb.Link>
);

/** 現在地の段。リンクにはせず aria-current で現在地であることを伝える */
const Page = ({
    className,
    ...props
}: ComponentProps<typeof ChlorophyllBreadcrumb.Page>) => (
    <ChlorophyllBreadcrumb.Page
        className={cx(truncateStyle, className)}
        {...props}
    />
);

/**
 * リンク先を持たない途中の段。現在地ではないので aria-current は付けない。
 * サイドバーの区分名のように、画面を持たない階層を表すときに使う
 */
const Text = ({ className, ...props }: ComponentProps<"span">) => (
    <span className={cx(textStyle, className)} {...props} />
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
    Item: ChlorophyllBreadcrumb.Item,
    Link: BreadcrumbLink,
    Page,
    Text,
    Separator: ChlorophyllBreadcrumb.Separator,
};
