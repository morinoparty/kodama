import { env } from "cloudflare:workers";
import { getRequest } from "@tanstack/react-start/server";
import { betterAuth } from "better-auth";
import { genericOAuth } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";

// buildAuth の戻り値から型を推論する。better-auth 1.6 以降は betterAuth() が
// 渡したオプションに対してジェネリックなため、ReturnType<typeof betterAuth> だと
// genericOAuth プラグインのエンドポイント型 (signInWithOAuth2 など) が失われる
type Auth = Awaited<ReturnType<typeof buildAuth>>;

// baseURL(= リクエストの origin)ごとに BetterAuth インスタンスをメモ化する。
// 固定のリダイレクト URL を持たないことで、production / PR ごとの
// preview バージョン / ローカル開発のどの origin でもそのまま動く
const authCache = new Map<string, Promise<Auth>>();

async function buildAuth(baseURL: string) {
    // AUTH_SECRET は Cloudflare Secrets Store バインディング (BSM: shared/AUTH_SECRET) から
    // 供給されるため、他の env とは異なり非同期の `.get()` で読み出す必要がある。
    // (Secrets Store バインディングは workerd の global scope での非同期 I/O を許可しないため、
    // モジュールトップレベルではなく初回リクエスト時に遅延解決してキャッシュする)
    const secret = await env.AUTH_SECRET.get();

    // BetterAuth の設定。
    // TanStack Start との連携のために tanstackStartCookies プラグインを最後に追加する。
    //
    // database を渡さない DB-less 構成: セッションとアカウント(MineAuth の
    // access/refresh token)はすべて暗号化クッキーに保存される。
    // isolate のメモリに依存しないため、Workers の isolate 入れ替えでも
    // ログイン状態とトークンが維持される
    return betterAuth({
        baseURL,
        secret,
        session: {
            // MineAuth の refresh token 寿命 (30日) に合わせる。
            // クッキー内セッションペイロードの expiresAt はこの値で決まり、
            // cookieCache.maxAge より短いとそちらが先に失効してしまう
            expiresIn: 60 * 60 * 24 * 30,
            cookieCache: {
                enabled: true,
                // DB-less ではこの値が session_data / account_data クッキーの
                // 寿命になる(= 実質のセッション上限)。refresh token と同じ30日
                maxAge: 60 * 60 * 24 * 30,
            },
        },
        account: {
            // MineAuth のトークン一式を account_data クッキーに保存する。
            // access token (300秒) が切れると getAccessToken が refresh token で
            // 自動更新し、ローテーション後の新 refresh token もクッキーに書き戻す
            storeAccountCookie: true,
        },
        plugins: [
            genericOAuth({
                config: [
                    {
                        providerId: "MineAuth",
                        clientId: env.CLIENT_ID,
                        // MineAuth のクライアントは public client (token_endpoint_auth_method: "none")
                        tokenEndpointAuth: { method: "none" },
                        pkce: true,
                        discoveryUrl: `${env.MAIN_SERVER_URL}/.well-known/openid-configuration`,
                        scopes: [
                            "openid",
                            "profile",
                            "email",
                            "roles",
                            "plugin",
                        ],
                    },
                ],
            }),
            // Better Auth 公式の TanStack Start 向けクッキープラグイン
            tanstackStartCookies(),
        ],
    });
}

/**
 * 現在のリクエストの origin を baseURL としたメモ化済み BetterAuth インスタンスを返す。
 * リクエストコンテキスト内(サーバー関数・ルートハンドラー)からのみ呼び出せる。
 * 呼び出し側は必ず await すること。
 */
export function getAuth(): Promise<Auth> {
    const origin = new URL(getRequest().url).origin;
    let auth = authCache.get(origin);
    if (!auth) {
        auth = buildAuth(origin);
        authCache.set(origin, auth);
    }
    return auth;
}
