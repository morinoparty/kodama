import { createFileRoute, Outlet } from "@tanstack/react-router";
import { css } from "styled-system/css";
import { AppHeader } from "../components/app-header";
import { AppSidebar } from "../components/app-sidebar";
import { SidebarProvider } from "../components/sidebar-provider";
import { authMiddleware } from "../lib/auth-middleware";
import { getSession } from "../lib/server-functions";

// このレイアウト配下のルートはすべてログイン必須にする。
// サーバー側のミドルウェアで未ログインを弾き、beforeLoad でセッションを
// ルートコンテキストに載せて子ルートから参照できるようにする
export const Route = createFileRoute("/_signed_in")({
    server: {
        middleware: [authMiddleware],
    },
    beforeLoad: async () => {
        const session = await getSession();
        return { session };
    },
    component: SignedInLayout,
});

// サイドバー + メインの 2 カラム。
// サイドバーは lg 未満では非表示になり、Drawer として開く
const layoutStyle = css({
    display: "flex",
    minHeight: "100dvh",
});

// minWidth: 0 がないと、幅の広い表やコードブロックで横スクロールが発生する
const contentStyle = css({
    display: "flex",
    flexDirection: "column",
    flex: "1",
    minWidth: "0",
});

const mainStyle = css({
    flex: "1",
    minWidth: "0",
});

function SignedInLayout() {
    return (
        <SidebarProvider>
            <div className={layoutStyle}>
                <AppSidebar />
                <div className={contentStyle}>
                    <AppHeader />
                    <main className={mainStyle}>
                        <Outlet />
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}
