import { createFileRoute, Outlet } from "@tanstack/react-router";
import { css } from "styled-system/css";
import { AppSidebar } from "../components/app-sidebar";
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

// lg 未満ではサイドバーが上部バーになるため縦積み、
// lg 以上ではサイドバー + メインの 2 カラムにする
const layoutStyle = css({
    display: "flex",
    flexDirection: { base: "column", lg: "row" },
    minHeight: "100dvh",
});

// minWidth: 0 がないと、幅の広い表やコードブロックで横スクロールが発生する
const mainStyle = css({
    flex: "1",
    minWidth: "0",
});

function SignedInLayout() {
    return (
        <div className={layoutStyle}>
            <AppSidebar />
            <main className={mainStyle}>
                <Outlet />
            </main>
        </div>
    );
}
