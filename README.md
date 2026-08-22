# 🌳 Kodama

Kodama は、もりのパーティの運営用サーバー管理 Web アプリケーションです。
プラグインの更新や鉄道の運行情報などを、MineAuth 経由で認証した上でブラウザから操作できます。

- 本番: <https://kodama.moripa.nikomaru.dev>
- Storybook: <https://story.kodama.moripa.nikomaru.dev>

## 📦 構成

pnpm workspace の 2 パッケージ構成です。

| パッケージ | 説明 |
| --- | --- |
| `app` (`@kodama/app`) | アプリケーション本体。TanStack Start を Cloudflare Workers (`kodama`) で動かす |
| `storybook` (`@kodama/storybook`) | UI コンポーネントのカタログ。ビルド結果を Worker (`kodama-storybook`) で配信する |

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
| `pnpm run build` | アプリの本番ビルド |
| `pnpm run build:storybook` | Storybook のビルド |
| `pnpm run build:all` | アプリと Storybook をまとめてビルドする |
| `pnpm run generate-routes` | `app/src/routeTree.gen.ts` を再生成する |
| `pnpm run cf-typegen` | `app/worker-configuration.d.ts` を再生成する |
| `pnpm run panda:codegen` | 各パッケージの `styled-system/` を再生成する |

## 🔐 認証について

認証は Better Auth の `genericOAuth` プラグイン経由で MineAuth の OIDC を利用します。
DB を持たない構成で、セッションと MineAuth のトークンは暗号化クッキーに保存されます。

- リダイレクト URI: `<origin>/api/auth/callback/MineAuth`
- `CLIENT_ID` / `MAIN_SERVER_URL` / `SERVER_URL` / `SERVERS` は `app/wrangler.jsonc` の `vars` に定義
- `AUTH_SECRET` は Cloudflare Secrets Store のバインディング (`shared_AUTH_SECRET`) から供給

ローカル開発用の環境変数は `app/.env.example` を参照してください。

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

- `main` への push で `deploy.yml` が Cloudflare Workers へ本番デプロイします。
  アプリ (`kodama`) と Storybook (`kodama-storybook`) は別の Worker ですが、同じ workflow で
  まとめてデプロイされます。
- PR を作ると `preview.yml` が preview バージョンを作り、URL と QR コードを PR にコメントします。
- `main` は GitHub の ruleset で保護されており、`Check` ワークフローが通った PR の squash merge でのみ更新されます。
