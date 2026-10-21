# ディレクトリ配置規則

kodama は pnpm workspace で、`app` (アプリ本体) と `storybook` (UI カタログ) の
2 パッケージに分かれています。

```
kodama/
  package.json          # workspace ルート。各パッケージへ委譲するスクリプトを持つ
  pnpm-workspace.yaml
  .npmrc                # @morinoparty スコープのレジストリ指定 (トークンは書かない)
  biome.json            # Biome の設定はリポジトリルートに 1 つだけ
  .agent/rules/         # CLAUDE.md / AGENTS.md の生成元
  .github/workflows/
  app/
  storybook/
```

## `app/`

- `app/package.json` — `@kodama/app`
- `app/panda.config.ts` — Panda CSS の設定 (Chlorophyll の preset を読み込む)
- `app/vite.config.ts` / `app/postcss.config.cjs` / `app/tsconfig.json` / `app/tsr.config.json`
- `app/cloudflare.config.ts` — Worker `kodama` の設定 (cf CLI)
- `app/.cloudflare/` — `cf build` / `pnpm run cf-typegen` の生成物 (型は `types/index.d.ts`)。gitignore 済み
- `app/styled-system/` — `panda codegen` の生成物。gitignore 済みで手を入れない

### `app/src/` 直下

- `app/src/routes/` — ファイルベースルーティングのルート定義
- `app/src/components/` — 全体で利用するコンポーネント
- `app/src/lib/` — 認証やユーティリティなど、複数のルートから使うロジック
- `app/src/style/app.css` — Panda のレイヤー宣言だけを置くグローバル CSS
- `app/src/router.tsx` — TanStack Router のインスタンス生成
- `app/src/routeTree.gen.ts` — 自動生成。手で編集しない

### `app/src/lib/`

- `app/src/lib/auth.ts` — Better Auth (MineAuth OIDC) のインスタンス生成
- `app/src/lib/auth-middleware.ts` — 未ログインをサインインページへ飛ばすリクエストミドルウェア
- `app/src/lib/server-functions/` — 複数のルートから使うサーバー関数

### `app/src/routes/`

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

## `storybook/`

- `storybook/package.json` — `@kodama/storybook`
- `storybook/stories/` — story ファイル (`*.stories.tsx`)。app のコンポーネントは `@/` で参照する
- `storybook/.storybook/main.ts` — Storybook の設定。ブラウザで解決できないモジュールの alias もここ
- `storybook/.storybook/preview.tsx` — ブランドパレットの適用など、全 story 共通のデコレーター
- `storybook/.storybook/dummy-router.tsx` — TanStack Router に依存する UI を story で描くためのダミー
- `storybook/.storybook/shims/` — TanStack Start / Workers ランタイム向けのスタブ
- `storybook/panda.config.ts` — app の設定を流用し、抽出対象と出力先だけ差し替える
- ビルド済みの `storybook-static/` は、app の Vite ビルド (`app/vite.config.ts` の `bundleStorybook`) が
  client アセットの `storybook/` にコピーし、Worker `kodama` の `/storybook/` 配下で配信する。専用の Worker は持たない

## `.github/workflows/`

- `check.yml` — Biome / 型チェック / ビルド。storybook → app の順にビルドする。
  main ブランチ保護の必須チェック
- `deploy.yml` — main への push で、Storybook をビルドしてから app (`kodama`、Storybook を同梱) を
  `cf build` → `cf deploy --dry-run` → `cf deploy` で Cloudflare Workers へ本番デプロイ
- `preview.yml` — PR ごとに `cf previews deploy` で app の preview を作り、app と `/storybook/` の URL と QR を PR にコメント
