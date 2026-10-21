import { bindings, defineConfig } from "cf/config";

// accountId は書かない。CLOUDFLARE_ACCOUNT_ID (.env / GitHub secrets) で渡す。
export default defineConfig({
    worker: {
        name: "kodama",
        compatibilityDate: "2025-09-02",
        compatibilityFlags: ["nodejs_compat", "global_fetch_strictly_public"],
        entrypoint: "@tanstack/react-start/server-entry",
        // 独自ドメインは持たず、https://kodama.morinoparty.workers.dev で配信する
        workersDev: true,
        // PR ごとの preview は `cf previews deploy` で行う
        previewUrls: true,
        observability: {
            enabled: true,
        },
        env: {
            // kodama 用の MineAuth OIDC クライアント。
            // リダイレクト URI は `<origin>/api/auth/callback/MineAuth`
            // (本番: https://kodama.morinoparty.workers.dev/api/auth/callback/MineAuth)
            CLIENT_ID: bindings.text("01a018fc-3495-755e-9782-eadc5a6038e6"),
            // MineAuth (OIDC プロバイダー) のベース URL
            MAIN_SERVER_URL: bindings.text("https://api.morino.party/main"),
            // 各 Minecraft サーバーの API ベース URL
            SERVER_URL: bindings.text("https://api.morino.party/"),
            // 管理対象サーバーの一覧
            SERVERS: bindings.text("main,res,lobby"),
            // 以下は Worker secret。deploy 時に `cf deploy --secrets-file` で渡し、
            // ローカルの cf dev では app/.env (または .dev.vars) から読む
            // Better Auth の署名鍵
            AUTH_SECRET: bindings.secret(),
            // MineAuth のサービスアカウント トークン (MPM などの管理系 API 用)
            MINEAUTH_SERVICE_TOKEN: bindings.secret(),
        },
    },
});
