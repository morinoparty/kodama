import { createServerFn } from "@tanstack/react-start";
import {
    PluginApiError,
    parseServerName,
    type ServerName,
} from "@/lib/plugin-api";
import { toPluginRows } from "../-functions/to-plugin-rows";
import type {
    ManagedPluginItem,
    OutdatedCheckResult,
    PluginRow,
} from "../-types";
import {
    fetchInstalledPlugins,
    fetchManagedPlugins,
    fetchOutdatedPlugins,
} from "./mpm";

/**
 * MPM の一覧を取得する。MPM が入っていないサーバーでは空として扱う。
 *
 * MPM が入っていないと API のルーティング自体が無く 404 になる (ロビーが今これ)。
 * 導入済みの一覧はコアの API なので取れており、それだけでも
 * 「全部が管理外」として表を出せる。ここで 404 を握り潰して続ける
 */
const fetchManagedOrEmpty = async (
    server: ServerName,
): Promise<ManagedPluginItem[]> => {
    try {
        return await fetchManagedPlugins(server);
    } catch (error) {
        if (error instanceof PluginApiError && error.status === 404) {
            return [];
        }
        throw error;
    }
};

/**
 * 更新チェックの結果を取得する。取れなければ null を返す。
 *
 * このチェックはプラグインごとに上流のリポジトリへ問い合わせるので、MPM が
 * 入っていない (404) ほかに、上流が落ちている (503) だけでも失敗する。
 * どちらも一覧そのものは MPM の記録値で描けるため、ページを落とさず続ける。
 * 代わりに、記録値は「更新チェックが取れていない」と分かる形で表示する
 */
const fetchOutdatedOrNull = async (
    server: ServerName,
): Promise<OutdatedCheckResult | null> => {
    try {
        return await fetchOutdatedPlugins(server);
    } catch (error) {
        if (error instanceof PluginApiError) {
            console.error(
                `更新チェックを取得できませんでした: ${error.message}`,
            );
            return null;
        }
        throw error;
    }
};

/**
 * 指定したサーバーのプラグイン一覧を取得する。
 *
 * 導入済みの一覧 (コア)・MPM の一覧・更新チェックの結果を並行して取り、
 * サーバー側で突き合わせてから返す。クライアントからの往復は 1 回で済む。
 *
 * 更新チェックは全プラグイン分の問い合わせが終わるまで返らないため、
 * このページの表示はいちばん遅い更新チェックに引きずられる。
 *
 * サーバー名はクライアントから渡ってきて URL の一部になるため、
 * `parseServerName` で既知の名前だけに絞ってから使う。
 */
export const getPlugins = createServerFn()
    .inputValidator((input: { server: string }) => ({
        server: parseServerName(input.server),
    }))
    .handler(async ({ data }): Promise<PluginRow[]> => {
        const [installed, managed, checked] = await Promise.all([
            fetchInstalledPlugins(data.server),
            fetchManagedOrEmpty(data.server),
            fetchOutdatedOrNull(data.server),
        ]);

        return toPluginRows(installed, managed, checked);
    });
