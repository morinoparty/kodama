# 🌳 Kodama

Kodama は、もりのパーティの運営用サーバー管理 Web アプリケーションです。
プラグインの更新や鉄道の運行情報などを、MineAuth 経由で認証した上でブラウザから操作できます。

- 本番: <https://kodama.morinoparty.workers.dev>
- Storybook: <https://kodama.morinoparty.workers.dev/storybook/>

## 📦 構成

pnpm workspace の 2 パッケージ構成です。

| パッケージ | 説明 |
| --- | --- |
| `app` (`@kodama/app`) | アプリケーション本体。TanStack Start を Cloudflare Workers (`kodama`) で動かす |
| `storybook` (`@kodama/storybook`) | UI コンポーネントのカタログ。ビルド結果を app の Worker (`kodama`) の `/storybook/` 配下で配信する |

Biome の設定と、各パッケージへ委譲するスクリプトはリポジトリルートにまとまっています。

## 🚀 開発を始める

### GitHub Packages の認証

UI ライブラリの `@morinoparty/chlorophyll-react` は GitHub Packages で配布されています。
リポジトリルートの `.npmrc` にレジストリの指定が入っているので、
`read:packages` 権限を持つ GitHub のトークンを `~/.npmrc` に置いてください。

```
//npm.pkg.github.com/:_authToken=<あなたのトークン>
```

トークンはリポジトリ内のファイルには絶対に書かないでください。

### 依存関係のインストール

```bash
pnpm install
```

Panda CSS の `styled-system/` は `prepare` スクリプト (`panda codegen`) で自動生成されます。

### 開発サーバーの起動

```bash
pnpm run dev            # アプリ本体
pnpm run dev:storybook  # Storybook
```

アプリは <http://localhost:3000>、Storybook は <http://localhost:6006> で起動します。

## ✨ よく使うコマンド

いずれもリポジトリルートで実行します。

| コマンド | 説明 |
| --- | --- |
| `pnpm run dev` | アプリの開発サーバーを起動する |
| `pnpm run dev:storybook` | Storybook を起動する |
| `pnpm run check` | Biome の lint / format / import 整列を自動修正付きで実行する |
| `pnpm run check:ci` | Biome のチェックのみ (CI と同じ) |
| `pnpm run typecheck` | 全パッケージの TypeScript 型チェック |
| `pnpm run build` | Storybook をビルドしてから、それを同梱したアプリの本番ビルド |
| `pnpm run build:storybook` | Storybook のビルド |
| `pnpm run generate-routes` | `app/src/routeTree.gen.ts` を再生成する |
| `pnpm run cf-typegen` | `app/.cloudflare/types/index.d.ts` を `cf workers types` で再生成する |
| `pnpm run panda:codegen` | 各パッケージの `styled-system/` を再生成する |

## 🔐 認証について

認証は Better Auth の `genericOAuth` プラグイン経由で MineAuth の OIDC を利用します。
DB を持たない構成で、セッションと MineAuth のトークンは暗号化クッキーに保存されます。

- リダイレクト URI: `<origin>/api/auth/callback/MineAuth`
- `CLIENT_ID` / `MAIN_SERVER_URL` / `SERVER_URL` / `SERVERS` は `app/cloudflare.config.ts` の `env` に定義
- `AUTH_SECRET` と `MINEAUTH_SERVICE_TOKEN` は Worker secret。本番は GitHub secrets から `cf deploy --secrets-file` で渡し、ローカルは `app/.env` から読む

ローカル開発用の環境変数と secret は `app/.env.example` を参照してください。

## 🛠 技術スタック

- Framework: TanStack Start (React 19)
- Runtime: Cloudflare Workers
- Language: TypeScript
- Package Manager: pnpm (workspace)
- CSS: Panda CSS + Chlorophyll (`@morinoparty/chlorophyll-react`)
- UI: Chlorophyll / Ark UI / lucide-react
- UI カタログ: Storybook
- Authentication: Better Auth + MineAuth (OIDC)
- Linter & Formatter: Biome

## 🚢 デプロイ

- デプロイには Cloudflare の CLI `cf` (devDependency) を使います。Worker の設定は
  `app/cloudflare.config.ts` にあります。
- `main` への push で `deploy.yml` が `cf build` → `cf deploy --prebuilt --mode production` で
  Cloudflare Workers (`*.morinoparty.workers.dev`) へ本番デプロイします。
  Storybook は別の Worker を持たず、`pnpm run build:storybook` の成果物 (`storybook/storybook-static`) を
  app の Vite ビルドが client アセットの `/storybook/` にコピーし、Worker `kodama` の静的アセットとして配信します
  (認証の外にあり、公開です)。`cf build` / `cf previews deploy` の前に Storybook をビルドしておく必要があります。
- PR を作ると `preview.yml` が `cf previews deploy` で preview を作り、URL と QR コードを PR にコメントします。
  preview は本番の secret を引き継がず、`cf previews deploy` には `--secrets-file` もありません。
  初回だけ人が Cloudflare ダッシュボードで Worker `kodama` → Settings → Variables and secrets の
  **Previews Base** に `AUTH_SECRET` と `MINEAUTH_SERVICE_TOKEN` を登録してください
  (`wrangler preview base-config secret put` でも登録できますが、cf にはまだ同等のコマンドがありません)。
  Base の secret は、登録後に作られた preview にだけ入ります。
  preview の origin でログインするには、その origin のリダイレクト URI を MineAuth に登録する必要もあります。
- CI が使う secret (`CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` / `AUTH_SECRET` / `MINEAUTH_SERVICE_TOKEN`) は
  GitHub secrets に置きます。`app/.env` に値を埋めて `gh secret set -f app/.env` で登録できます。
- 手元からデプロイする場合は `app/.env` に `CLOUDFLARE_ACCOUNT_ID` と
  `CLOUDFLARE_API_TOKEN` を置き、`pnpm run build:storybook` のあと `app/` で `pnpm exec cf deploy` を実行します
  (secret は `--secrets-file` で渡します)。
- `main` は GitHub の ruleset で保護されており、`Check` ワークフローが通った PR の squash merge でのみ更新されます。
