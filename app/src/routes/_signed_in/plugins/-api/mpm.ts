import { fetchPluginApi, type ServerName } from "@/lib/plugin-api";
import type { PluginItem } from "../-types";

// MPM プラグイン API の呼び出し。
// サーバー関数はページごとに用意するため、ここは素の関数として置いている

const BASE_PATH = "/api/v1/plugins/mpm";

/**
 * 指定したサーバーに導入されているプラグインの一覧を取得する。
 *
 * この API はページングを持たず、常に全件を返す。
 * 現在のバージョンと最新バージョンの両方が含まれるので、
 * 更新の要否だけを返す `/plugins/outdated` は使わない。
 *
 * MPM は運営操作用の API で、ログイン中の Minecraft プレイヤーに紐づかない。
 * ユーザーの access token だとオフライン時に 403 `player_offline` になるため、
 * サービスアカウントのトークンで叩く。
 */
export const fetchPlugins = (server: ServerName): Promise<PluginItem[]> =>
    fetchPluginApi<PluginItem[]>(`${BASE_PATH}/plugins`, "プラグイン一覧", {
        server,
        auth: "service",
    });
