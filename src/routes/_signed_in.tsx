import { createFileRoute, Outlet } from "@tanstack/react-router";
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

function SignedInLayout() {
    return <Outlet />;
}
