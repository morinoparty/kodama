import { createFileRoute } from "@tanstack/react-router";
import { getAuth } from "../../../lib/auth";

// Better Auth のすべてのエンドポイント(/api/auth/*)をこのルートで受ける。
// OIDC の認可リクエスト・コールバック・セッション取得などがここを通る
export const Route = createFileRoute("/api/auth/$")({
    server: {
        handlers: {
            GET: async ({ request }) => {
                const auth = await getAuth();
                return auth.handler(request);
            },
            POST: async ({ request }) => {
                const auth = await getAuth();
                return auth.handler(request);
            },
        },
    },
});
