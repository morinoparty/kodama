# 🌳 Kodama

Kodama は、もりのパーティの運営用サーバー管理 Web アプリケーションです。
プラグインの更新や鉄道の運行情報などを、MineAuth 経由で認証した上でブラウザから操作できます。

- 本番: <https://kodama.moripa.nikomaru.dev>

## 🚀 開発を始める

### 依存関係のインストール

```bash
pnpm install
```

### 開発サーバーの起動

```bash
pnpm run dev
```

<http://localhost:3000> で起動します。

## ✨ よく使うコマンド

| コマンド | 説明 |
| --- | --- |
| `pnpm run dev` | 開発サーバーを起動する |
| `pnpm run check` | Biome の lint / format / import 整列を自動修正付きで実行する |
| `pnpm run check:ci` | Biome のチェックのみ (CI と同じ) |
| `pnpm run typecheck` | TypeScript の型チェック |
| `pnpm run build` | 本番ビルド |
| `pnpm run generate-routes` | `src/routeTree.gen.ts` を再生成する |
| `pnpm run cf-typegen` | `worker-configuration.d.ts` を再生成する |

## 🔐 認証について

認証は Better Auth の `genericOAuth` プラグイン経由で MineAuth の OIDC を利用します。
DB を持たない構成で、セッションと MineAuth のトークンは暗号化クッキーに保存されます。

- リダイレクト URI: `<origin>/api/auth/callback/MineAuth`
- `CLIENT_ID` / `MAIN_SERVER_URL` / `SERVER_URL` / `SERVERS` は `wrangler.jsonc` の `vars` に定義
- `AUTH_SECRET` は Cloudflare Secrets Store のバインディング (`shared_AUTH_SECRET`) から供給

ローカル開発用の環境変数は `.env.example` を参照してください。

## 🛠 技術スタック

- Framework: TanStack Start (React 19)
- Runtime: Cloudflare Workers
- Language: TypeScript
- Package Manager: pnpm
- CSS: Tailwind CSS v4
- Authentication: Better Auth + MineAuth (OIDC)
- Linter & Formatter: Biome

## 🚢 デプロイ

- `main` への push で `deploy.yml` が Cloudflare Workers へ本番デプロイします。
- PR を作ると `preview.yml` が preview バージョンを作り、URL と QR コードを PR にコメントします。
- `main` は GitHub の ruleset で保護されており、`Check` ワークフローが通った PR の squash merge でのみ更新されます。
