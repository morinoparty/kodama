# コーディングプラクティス

## 実装手順

1. **型設計**
   - まず型 (interface / type) を定義する

2. **純粋関数から実装**
   - 外部依存のない関数を先に実装する

## 実装時の注意点

- 常に既存コードの設計や記法を参考にしてください。
- 書籍「リーダブルコード」のようなベストプラクティスを常に適用してください。
- コードの意図・背景などのコメントを日本語で積極的に入れてください。
- 関数が長くなる場合、適切な粒度でメソッドを分割してください。
- ファイル・ディレクトリの命名規則は kebab-case を使用してください。
- 過度な抽象化を避け、小さく始めて段階的に拡張してください。

## TanStack Start

- ルートは `src/routes/` のファイルベースルーティングで定義します。ルートファイルを追加・削除したら
  `pnpm run generate-routes` で `src/routeTree.gen.ts` を再生成してください（`pnpm run dev` 中は自動生成されます）。
- サーバー側でしか動かせない処理は `createServerFn()` で書き、クライアントからはただの関数として呼びます。
- サーバー関数のコンテキストには `request` が含まれません。リクエストのヘッダーなどが必要な場合は
  `@tanstack/react-start/server` の `getRequest()` を使ってください。
- HTTP エンドポイントが必要な場合は、ルートの `server.handlers` に `GET` / `POST` などを定義します。
  （例: `src/routes/api/auth/$.tsx`）
- Cloudflare のバインディングや環境変数は `cloudflare:workers` の `env` から参照します。
  `wrangler.jsonc` を変更したら `pnpm run cf-typegen` で `worker-configuration.d.ts` を更新してください。

## ビルド・確認コマンド

- 依存関係のインストール: `pnpm install`
- 開発サーバーの起動: `pnpm run dev` (3000 番ポート)
- Biome によるチェックと自動修正: `pnpm run check`
- 型チェック: `pnpm run typecheck`
- ビルド: `pnpm run build`

コードを書いた後は必ず `pnpm run check` と `pnpm run typecheck` を実行してください。
なお、記述後に `pnpm run dev` の実行やデプロイは行わないでください。
