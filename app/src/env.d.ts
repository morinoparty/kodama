// 実行時シークレットの型。
//
// cloudflare.config.ts の `bindings.secret()` から `pnpm run cf-typegen` の生成物
// (.cloudflare/types/index.d.ts) にも同じ宣言が出る。interface のマージで矛盾しないよう、
// 型は optional にせず string のままにすること。

declare namespace Cloudflare {
    interface Env {
        /**
         * MineAuth のサービスアカウント トークン。
         * ログイン中のプレイヤーに紐づかない管理系 API (MPM など) で使う。
         *
         * 本番へは Deploy ワークフローが `cf deploy --secrets-file` で投入する。
         * ローカルは app/.env に置く (.env.example を参照)
         */
        MINEAUTH_SERVICE_TOKEN: string;
    }
}

interface Env {
    MINEAUTH_SERVICE_TOKEN: string;
}
