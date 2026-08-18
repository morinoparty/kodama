## このアプリケーションの概要

「Kodama（木霊）」は、もりのパーティの運営用サーバー管理 Web アプリケーションです。
運営メンバーが MineAuth アカウントでログインし、ブラウザからサーバーの状態を確認・操作できます。

## 主な機能

- MineAuth (OIDC) によるログインと、ロールに基づいた運営機能へのアクセス制御
- 各サーバーに導入されているプラグインの一覧表示と更新
- 鉄道（路線・駅・運行状況）の情報の参照と編集
- そのほか、もりのパーティのサーバー運営に必要な管理機能

## 主な技術スタック

- **Framework**: TanStack Start (React 19 + TanStack Router のフルスタックフレームワーク)
- **Runtime**: Cloudflare Workers (`@cloudflare/vite-plugin` + Wrangler)
- **Language**: TypeScript
- **Package Manager**: pnpm
- **CSS**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Authentication**: Better Auth + MineAuth の OIDC (genericOAuth プラグイン)
- **Linter & Formatter**: Biome
- **CI/CD**: GitHub Actions (Check / Deploy / Preview)

## 公開先

- 本番: <https://kodama.moripa.nikomaru.dev>
- プレビュー: PR ごとに `wrangler versions upload` で発行される preview URL
