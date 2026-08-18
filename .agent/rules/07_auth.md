# 認証 (MineAuth + Better Auth)

## 全体像

- 認証は Better Auth の `genericOAuth` プラグインで MineAuth の OIDC を扱います。
- MineAuth のクライアントは public client (`token_endpoint_auth_method: "none"`) なので、
  `tokenEndpointAuth: { method: "none" }` と PKCE を使います。
- **DB を持たない構成**です。セッションと MineAuth のトークン一式は暗号化クッキーに保存されます
  (`session.cookieCache` と `account.storeAccountCookie`)。Workers の isolate が入れ替わっても
  ログイン状態が維持されます。
- `getAuth()` はリクエストの origin を `baseURL` としてインスタンスをメモ化します。
  固定のリダイレクト URL を持たないため、本番・preview・ローカルのどの origin でも動きます。

## 実装上のルール

- Better Auth のインスタンスは必ず `src/lib/auth.ts` の `getAuth()` から取得し、`await` してください。
  リクエストコンテキストの外（モジュールトップレベルなど）では呼べません。
- ログインが必要なページは `src/routes/_signed_in/` 配下に作ってください。
  `_signed_in.tsx` の `server.middleware` が未ログインを弾きます。
- MineAuth の API を叩くときは `auth.api.getAccessToken({ body: { useAccountCookie: true }, headers })`
  でアクセストークンを取得してください。失効していれば refresh token で自動更新されます。
- ユーザー情報は `/oauth2/userinfo` から取得します。ロール (`roles`) で運営権限を判定します。

## 環境変数・シークレット

- `CLIENT_ID` / `MAIN_SERVER_URL` / `SERVER_URL` / `SERVERS` は `wrangler.jsonc` の `vars` に定義します。
- `AUTH_SECRET` は Cloudflare Secrets Store のバインディング (`shared_AUTH_SECRET`) から供給されます。
  他の env と違い非同期の `.get()` で読み出す必要があります。
- リダイレクト URI は `<origin>/api/auth/callback/MineAuth` です。
  新しい origin を使う場合は MineAuth 側にも登録が必要です。
