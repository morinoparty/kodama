## このアプリケーションの概要

「Kodama（木霊）」は、もりのパーティの運営用サーバー管理 Web アプリケーションです。
運営メンバーが MineAuth アカウントでログインし、ブラウザからサーバーの状態を確認・操作できます。

pnpm workspace の 2 パッケージ構成です。

- `app` (`@kodama/app`) — アプリケーション本体
- `storybook` (`@kodama/storybook`) — UI コンポーネントのカタログ

## 主な機能

- MineAuth (OIDC) によるログインと、ロールに基づいた運営機能へのアクセス制御
- 各サーバーに導入されているプラグインの一覧表示と更新
- 鉄道（路線・駅・運行状況）の情報の参照と編集
- そのほか、もりのパーティのサーバー運営に必要な管理機能

## 主な技術スタック

- **Framework**: TanStack Start (React 19 + TanStack Router のフルスタックフレームワーク)
- **Runtime**: Cloudflare Workers (`@cloudflare/vite-plugin` + `cf` CLI)
- **Language**: TypeScript
- **Package Manager**: pnpm (workspace)
- **CSS**: Panda CSS + Chlorophyll (`@morinoparty/chlorophyll-react`)
- **UI**: Chlorophyll のコンポーネント / Ark UI (`@ark-ui/react`) / アイコンは `lucide-react`
- **UI カタログ**: Storybook (`@storybook/react-vite`)
- **Authentication**: Better Auth + MineAuth の OIDC (genericOAuth プラグイン)
- **Linter & Formatter**: Biome
- **CI/CD**: GitHub Actions (Check / Deploy / Preview)

Chlorophyll は npmjs で公開されているため、インストールにトークンなどの追加設定は不要です。

## 公開先

- 本番: <https://kodama.morinoparty.workers.dev> (Worker 名 `kodama`)
- Storybook: <https://kodama.morinoparty.workers.dev/storybook/> (Worker `kodama` の静的アセットとして配信)
- プレビュー: PR ごとに `cf previews deploy` で発行される preview URL
