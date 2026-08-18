# ディレクトリ配置規則

kodama は単一パッケージ構成で、アプリケーションのソースはすべて `src/` 配下に置きます。

## `src/` 直下

- `src/routes/` — ファイルベースルーティングのルート定義
- `src/components/` — 全体で利用するコンポーネント
- `src/lib/` — 認証やユーティリティなど、複数のルートから使うロジック
- `src/styles.css` — Tailwind CSS の設定とデザイントークン
- `src/router.tsx` — TanStack Router のインスタンス生成
- `src/routeTree.gen.ts` — 自動生成。手で編集しない

## `src/lib/`

- `src/lib/auth.ts` — Better Auth (MineAuth OIDC) のインスタンス生成
- `src/lib/auth-middleware.ts` — 未ログインをサインインページへ飛ばすリクエストミドルウェア
- `src/lib/server-functions/` — 複数のルートから使うサーバー関数

## `src/routes/`

- `_signed_in.tsx` / `_signed_in/` — ログイン必須のページをまとめるレイアウトルート
- `auth/sign-in/` — サインインページ（ログイン前に見えるので `_signed_in` の外に置く）
- `api/auth/$.tsx` — Better Auth のエンドポイント

各ルート内には以下のディレクトリを配置してください。

- `aaa/bbb/ccc/-components/`
  - ルート内で使用される UI コンポーネント
- `aaa/bbb/ccc/-api/`
  - ルート内で使用される API 通信のためのサーバー関数 / Hooks
- `aaa/bbb/ccc/-types/`
  - ルート内で使用される型定義
- `aaa/bbb/ccc/-functions/`
  - ルート内で使用される関数

`-` で始まるディレクトリはルーティングの対象外になります。

## `.github/workflows/`

- `check.yml` — Biome / 型チェック / ビルド。main ブランチ保護の必須チェック
- `deploy.yml` — main への push で Cloudflare Workers へ本番デプロイ
- `preview.yml` — PR ごとに preview バージョンを作り、URL と QR を PR にコメント
