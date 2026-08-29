// `wrangler secret put` で投入する実行時シークレットの型。
//
// wrangler.jsonc に現れないシークレットは `pnpm run cf-typegen` の生成物
// (worker-configuration.d.ts) に載らないため、ここで Env に足しておく。
// 生成物側が同じ宣言を出しても interface のマージで矛盾しないよう、
// 型は optional にせず string のままにすること。

declare namespace Cloudflare {
    interface Env {
        /**
         * MineAuth のサービスアカウント トークン。
         * ログイン中のプレイヤーに紐づかない管理系 API (MPM など) で使う。
         *
         * 本番へは Deploy ワークフローが `wrangler secret put` で同期する。
         * ローカルは app/.dev.vars に置く (.dev.vars.example を参照)
         */
        MINEAUTH_SERVICE_TOKEN: string;
    }
}

interface Env {
    MINEAUTH_SERVICE_TOKEN: string;
}
