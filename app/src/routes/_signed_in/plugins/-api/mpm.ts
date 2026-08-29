import { fetchPluginApi, type ServerName } from "@/lib/plugin-api";
import type { InstalledPluginItem, ManagedPluginItem } from "../-types";

// プラグイン一覧に使う API の呼び出し。
// サーバー関数はページごとに用意するため、ここは素の関数として置いている

// MPM もコアの API も、ログイン中の Minecraft プレイヤーには紐づかない運営操作用の
// API なので、サービスアカウントのトークンで叩く。
// (ユーザーの access token だとプレイヤーがオフラインのとき 403 になる)
const SERVICE = { auth: "service" } as const;

/**
 * MPM が管理しているプラグインの一覧を取得する。
 *
 * この API はページングを持たず、常に全件を返す。
 * 現在のバージョンと最新バージョンの両方が含まれるので、
 * 更新の要否だけを返す `/plugins/outdated` は使わない。
 */
export const fetchManagedPlugins = (
    server: ServerName,
): Promise<ManagedPluginItem[]> =>
    fetchPluginApi<ManagedPluginItem[]>(
        "/api/v1/plugins/mpm/plugins",
        "MPM のプラグイン一覧",
        { server, ...SERVICE },
    );

/**
 * サーバーに実際に入っているプラグインの一覧を取得する。
 *
 * MPM ではなく MineAuth コアの API なので、MPM が入っていないサーバーでも取れる。
 * MPM の一覧との差分が、MPM の管理下にないプラグインになる。
 */
export const fetchInstalledPlugins = (
    server: ServerName,
): Promise<InstalledPluginItem[]> =>
    fetchPluginApi<InstalledPluginItem[]>(
        "/api/v1/commons/server/plugins",
        "導入済みプラグイン一覧",
        { server, ...SERVICE },
    );
