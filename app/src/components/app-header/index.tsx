import { Button } from "@morinoparty/chlorophyll-react";
import { MenuIcon, PanelLeftCloseIcon, PanelLeftOpenIcon } from "lucide-react";
import { css } from "styled-system/css";
import { AppBreadcrumb } from "../app-breadcrumb";
import { useSidebar } from "../sidebar-provider";

// ページ内容 (カードや表) がスクロール中にヘッダーの上へ出てこないよう
// zIndex を持たせる。Drawer などの Portal はさらに上のレイヤーに描かれる
const headerStyle = css({
    display: "flex",
    alignItems: "center",
    gap: "2",
    position: "sticky",
    top: "0",
    zIndex: "sticky",
    flexShrink: "0",
    height: "14",
    px: { base: "3", sm: "4" },
    bg: "bg.panel",
    borderBlockEndWidth: "1px",
    borderBlockEndStyle: "solid",
    borderColor: "border.subtle",
});

// lg 未満だけに出す Drawer の開閉ボタン
const mobileTriggerStyle = css({
    flexShrink: "0",
    lg: { display: "none" },
});

// lg 以上だけに出すサイドバーの折りたたみボタン
const desktopTriggerStyle = css({
    display: "none",
    flexShrink: "0",
    lg: { display: "inline-flex" },
});

// パンくずとボタンの間の縦罫線。装飾なので読み上げからは外す。
// Separator も Chlorophyll に無いため、morinoparty/Chlorophyll#77 で提案している
const separatorStyle = css({
    flexShrink: "0",
    alignSelf: "center",
    width: "1px",
    height: "6",
    mx: "1",
    bg: "border",
});

// パンくずが長いときにヘッダーを押し広げないよう、はみ出しはこの中で吸収する
const breadcrumbAreaStyle = css({
    flex: "1",
    minWidth: "0",
    overflowX: "auto",
    scrollbarWidth: "none",
    "&::-webkit-scrollbar": { display: "none" },
});

/**
 * ログイン後の画面の上部ヘッダー。
 * サイドバーの開閉ボタンと、現在地を表すパンくずリストを並べる。
 *
 * 開閉ボタンは lg 未満では Drawer を開き、lg 以上ではサイドバーを
 * 折りたたむ。どちらの見た目になるかは CSS のブレークポイントで決まるため、
 * ボタン自体を 2 つ用意して表示を切り替えている。
 */
export function AppHeader() {
    const { isDesktopOpen, toggleDesktop, openMobile } = useSidebar();

    return (
        <header className={headerStyle}>
            <Button
                intent="plain"
                size="sm"
                className={mobileTriggerStyle}
                aria-label="メニューを開く"
                onClick={openMobile}
            >
                <MenuIcon aria-hidden="true" />
            </Button>

            <Button
                intent="plain"
                size="sm"
                className={desktopTriggerStyle}
                aria-label={
                    isDesktopOpen
                        ? "サイドバーを折りたたむ"
                        : "サイドバーを開く"
                }
                aria-expanded={isDesktopOpen}
                onClick={toggleDesktop}
            >
                {isDesktopOpen ? (
                    <PanelLeftCloseIcon aria-hidden="true" />
                ) : (
                    <PanelLeftOpenIcon aria-hidden="true" />
                )}
            </Button>

            <div className={separatorStyle} aria-hidden="true" />

            <div className={breadcrumbAreaStyle}>
                <AppBreadcrumb />
            </div>
        </header>
    );
}
