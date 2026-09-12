import { fetchPluginApi, type ServerName } from "@/lib/plugin-api";
import type {
    InstalledPluginItem,
    ManagedPluginItem,
    OutdatedCheckResult,
} from "../-types";

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
 * ただし返る `latestVersion` / `isOutdated` はメタデータの読み出しでしかなく、
 * `mpm.json` の Fixed 指定 (pin / rollback での固定) は反映されない。
 * 更新先として実際に使われるバージョンは `fetchOutdatedPlugins` から取る。
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

/**
 * MPM の更新チェックの結果を取得する。
 *
 * 一覧の `latestVersion` と違い、こちらは呼ぶたびに上流のリポジトリへ問い合わせ直す。
 * そのうえで `mpm.json` の指定を踏まえて更新先を決めるため、Fixed 指定のプラグインは
 * 固定したバージョン自体が `latestVersion` になる (Sync 指定なら追従先の親に合わせる)。
 *
 * プラグインごとに問い合わせるので一部だけ失敗しうる。失敗したものは `errors` に入り、
 * `outdated` からは抜ける。全件分の問い合わせが終わるまで返らないため、
 * 一覧の取得より時間がかかる。
 */
export const fetchOutdatedPlugins = (
    server: ServerName,
): Promise<OutdatedCheckResult> =>
    fetchPluginApi<OutdatedCheckResult>(
        "/api/v1/plugins/mpm/plugins/outdated",
        "MPM の更新チェック",
        { server, ...SERVICE },
    );
