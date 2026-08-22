import { Drawer, Portal } from "@morinoparty/chlorophyll-react";
import { Link, type LinkProps, useRouterState } from "@tanstack/react-router";
import { ExternalLinkIcon, SproutIcon } from "lucide-react";
import type { ReactNode } from "react";
import { css } from "styled-system/css";
import { LogoutButton } from "../logout-button";
import { useSidebar } from "../sidebar-provider";

// アプリ内のページへのリンク。to は Link と同じ型にしてあるので、
// 存在しないパスを書くとその場で型エラーになる
interface NavItem {
    readonly title: string;
    readonly to: LinkProps["to"];
}

interface NavGroup {
    readonly title: string;
    readonly items: readonly NavItem[];
}

// 外部サイトなど、SPA のルーティング外へのリンク
interface ExternalNavItem {
    readonly title: string;
    readonly url: string;
    /** 同一オリジンでも別タブで開きたいときに明示する */
    readonly opensInNewTab?: boolean;
}

// ページが増えたときはこの配列にグループ・項目を足すだけで済むようにしている
const NAV_GROUPS = [
    {
        title: "ホーム",
        items: [{ title: "ホーム", to: "/" }],
    },
] as const satisfies readonly NavGroup[];

// フッターに置く参考リンク。運営メンバーがすぐ辿れるようにしておく
const RESOURCES: readonly ExternalNavItem[] = [
    { title: "GitHub", url: "https://github.com/morinoparty/kodama" },
    { title: "Storybook", url: "https://story.kodama.moripa.nikomaru.dev" },
];

// デプロイ時刻はビルド時に環境変数から埋め込む。未設定なら表示しない
const DEPLOYED_AT: string = import.meta.env.VITE_DEPLOYED_AT ?? "";

// --- スタイル定義 -------------------------------------------------------

// サイドバーの中身。デスクトップの aside とモバイルの Drawer で共有する
const bodyStyle = css({
    display: "flex",
    flexDirection: "column",
    height: "full",
    minHeight: "0",
    gap: "2",
    px: "3",
    py: "4",
});

const headerRowStyle = css({
    display: "flex",
    alignItems: "center",
    gap: "2",
});

const brandStyle = css({
    display: "flex",
    alignItems: "center",
    gap: "3",
    flex: "1",
    minWidth: "0",
    px: "2",
    py: "2",
    borderRadius: "lg",
    textDecoration: "none",
    color: "fg",
    _hover: { bg: "bg.muted" },
    // outline: "none" だと outline-style が none のまま残り、
    // ringWidth を足してもフォーカスリングが描かれない
    _focusVisible: {
        outlineStyle: "solid",
        outlineWidth: "2px",
        outlineColor: "colorPalette.focus.ring",
        outlineOffset: "2px",
    },
});

const brandMarkStyle = css({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: "0",
    width: "9",
    height: "9",
    borderRadius: "lg",
    bg: "colorPalette.solid",
    color: "colorPalette.contrast",
});

const brandTextStyle = css({
    display: "flex",
    flexDirection: "column",
    minWidth: "0",
    lineHeight: "tight",
});

const brandNameStyle = css({
    textStyle: "md",
    fontWeight: "bold",
    truncate: true,
});

const brandCaptionStyle = css({
    textStyle: "xs",
    color: "fg.muted",
    truncate: true,
});

const navStyle = css({
    display: "flex",
    flexDirection: "column",
    gap: "4",
    flex: "1",
    minHeight: "0",
    overflowY: "auto",
    mt: "2",
});

const groupLabelStyle = css({
    px: "3",
    pb: "1",
    textStyle: "xs",
    fontWeight: "semibold",
    color: "fg.subtle",
});

const listStyle = css({
    display: "flex",
    flexDirection: "column",
    gap: "0.5",
    listStyle: "none",
    margin: "0",
    padding: "0",
});

// ナビ項目の共通スタイル。アクティブ状態は aria-current で見た目を切り替える
const navLinkStyle = css({
    display: "flex",
    alignItems: "center",
    gap: "2",
    width: "full",
    px: "3",
    py: "2",
    borderRadius: "md",
    textStyle: "sm",
    fontWeight: "medium",
    color: "fg.muted",
    textDecoration: "none",
    transitionProperty: "background, color",
    transitionDuration: "fast",
    transitionTimingFunction: "easeInOut",
    _hover: {
        bg: "bg.muted",
        color: "fg",
    },
    // outline: "none" だと outline-style が none のまま残り、
    // ringWidth を足してもフォーカスリングが描かれない
    _focusVisible: {
        outlineStyle: "solid",
        outlineWidth: "2px",
        outlineColor: "colorPalette.focus.ring",
        outlineOffset: "2px",
    },
    "&[aria-current='page']": {
        bg: "colorPalette.bg.subtle",
        color: "colorPalette.fg",
        fontWeight: "semibold",
    },
    "& :where(svg)": {
        width: "4",
        height: "4",
        flexShrink: "0",
    },
});

const navLinkLabelStyle = css({ flex: "1", minWidth: "0", truncate: true });

const footerStyle = css({
    display: "flex",
    flexDirection: "column",
    gap: "2",
    mt: "auto",
    pt: "3",
    borderBlockStartWidth: "1px",
    borderBlockStartStyle: "solid",
    borderColor: "border.subtle",
});

const footerActionsStyle = css({
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "2",
    px: "1",
    pt: "1",
});

const buildInfoStyle = css({
    px: "3",
    pt: "2",
    textStyle: "xs",
    color: "fg.subtle",
});

// 常時表示のサイドバー (lg 以上)
const asideStyle = css({
    display: "none",
    lg: { display: "flex" },
    flexDirection: "column",
    position: "sticky",
    top: "0",
    height: "100dvh",
    width: "64",
    flexShrink: "0",
    bg: "bg.panel",
    borderInlineEndWidth: "1px",
    borderInlineEndStyle: "solid",
    borderColor: "border.subtle",
});

// Drawer の既定幅 (maxWidth: sm) はサイドバーには広いので絞る
const drawerContentStyle = css({ maxWidth: "72" });

// 閉じるボタンは既定で右上へ絶対配置されるが、
// ここではヘッダー行に並べたいので通常フローに戻す
const drawerCloseStyle = css({
    position: "static",
    flexShrink: "0",
});

// --- サブコンポーネント -------------------------------------------------

function Brand({ onNavigate }: { onNavigate?: () => void }) {
    return (
        <Link to="/" className={brandStyle} onClick={onNavigate}>
            <span className={brandMarkStyle} aria-hidden="true">
                <SproutIcon size={20} />
            </span>
            <span className={brandTextStyle}>
                <span className={brandNameStyle}>Kodama</span>
                <span className={brandCaptionStyle}>
                    もりのパーティ 運営ツール
                </span>
            </span>
        </Link>
    );
}

function NavLink({
    item,
    isActive,
    onNavigate,
}: {
    item: NavItem;
    isActive: boolean;
    onNavigate?: () => void;
}) {
    return (
        <Link
            to={item.to}
            className={navLinkStyle}
            aria-current={isActive ? "page" : undefined}
            onClick={onNavigate}
        >
            <span className={navLinkLabelStyle}>{item.title}</span>
        </Link>
    );
}

function ExternalNavLink({ item }: { item: ExternalNavItem }) {
    // 別オリジンは常に別タブ。同一オリジンでも opensInNewTab で明示できる
    const opensInNewTab = item.opensInNewTab ?? item.url.startsWith("https://");

    return (
        <a
            href={item.url}
            className={navLinkStyle}
            target={opensInNewTab ? "_blank" : undefined}
            rel={opensInNewTab ? "noreferrer" : undefined}
            aria-label={
                opensInNewTab ? `${item.title}（新しいタブで開く）` : item.title
            }
        >
            <span className={navLinkLabelStyle}>{item.title}</span>
            {opensInNewTab ? <ExternalLinkIcon aria-hidden="true" /> : null}
        </a>
    );
}

// サイドバーの中身。デスクトップと Drawer の両方から同じものを描画する。
// onNavigate は Drawer 内で項目を押したときに閉じるために使う
function SidebarBody({
    onNavigate,
    closeSlot,
}: {
    onNavigate?: () => void;
    closeSlot?: ReactNode;
}) {
    const pathname = useRouterState({
        select: (state) => state.location.pathname,
    });

    return (
        <div className={bodyStyle}>
            <div className={headerRowStyle}>
                <Brand onNavigate={onNavigate} />
                {closeSlot}
            </div>

            <nav className={navStyle} aria-label="メインナビゲーション">
                {NAV_GROUPS.map((group) => (
                    <div key={group.title}>
                        <p className={groupLabelStyle}>{group.title}</p>
                        <ul className={listStyle}>
                            {group.items.map((item) => (
                                <li key={item.title}>
                                    <NavLink
                                        item={item}
                                        isActive={pathname === item.to}
                                        onNavigate={onNavigate}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </nav>

            <div className={footerStyle}>
                <ul className={listStyle}>
                    {RESOURCES.map((item) => (
                        <li key={item.title}>
                            <ExternalNavLink item={item} />
                        </li>
                    ))}
                </ul>
                <div className={footerActionsStyle}>
                    <LogoutButton />
                </div>
                <p className={buildInfoStyle}>
                    {DEPLOYED_AT ? (
                        <>
                            Deployed: {DEPLOYED_AT.split(".")[0]}
                            <br />
                        </>
                    ) : null}
                    No right reserved.
                </p>
            </div>
        </div>
    );
}

// --- 本体 ---------------------------------------------------------------

/**
 * 運営ツールのサイドバー。
 * lg 以上では画面左に表示し、ヘッダーのボタンで折りたたむ。
 * lg 未満ではヘッダーのボタンから Drawer として開く。
 *
 * 開閉ボタンはヘッダー (AppHeader) 側にあるため、状態は
 * SidebarProvider の Context から受け取る。
 */
export function AppSidebar() {
    const { isDesktopOpen, isMobileOpen, setMobileOpen, closeMobile } =
        useSidebar();

    return (
        <>
            {/* lg 未満: Drawer。閉じたときのフォーカスは Ark UI が
                開く前にフォーカスしていた要素 (ヘッダーのボタン) へ戻す */}
            <Drawer.Root
                placement="start"
                open={isMobileOpen}
                onOpenChange={(details) => setMobileOpen(details.open)}
            >
                <Portal>
                    <Drawer.Backdrop />
                    <Drawer.Positioner>
                        <Drawer.Content
                            className={drawerContentStyle}
                            aria-label="サイドバー"
                        >
                            <SidebarBody
                                onNavigate={closeMobile}
                                closeSlot={
                                    <Drawer.CloseTrigger
                                        className={drawerCloseStyle}
                                        aria-label="メニューを閉じる"
                                    />
                                }
                            />
                        </Drawer.Content>
                    </Drawer.Positioner>
                </Portal>
            </Drawer.Root>

            {/* lg 以上: 常時表示のサイドバー。折りたたみ中は
                キーボード操作の対象にも残らないよう要素ごと描画しない */}
            {isDesktopOpen ? (
                <aside className={asideStyle}>
                    <SidebarBody />
                </aside>
            ) : null}
        </>
    );
}
