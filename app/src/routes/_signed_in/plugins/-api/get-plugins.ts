import { createServerFn } from "@tanstack/react-start";
import {
    PluginApiError,
    parseServerName,
    type ServerName,
} from "@/lib/plugin-api";
import { toPluginRows } from "../-functions/to-plugin-rows";
import type { ManagedPluginItem, PluginRow } from "../-types";
import { fetchInstalledPlugins, fetchManagedPlugins } from "./mpm";

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
 * 指定したサーバーのプラグイン一覧を取得する。
 *
 * 導入済みの一覧 (コア) と MPM の一覧を並行して取り、サーバー側で突き合わせてから返す。
 * クライアントからの往復は 1 回で済む。
 *
 * サーバー名はクライアントから渡ってきて URL の一部になるため、
 * `parseServerName` で既知の名前だけに絞ってから使う。
 */
export const getPlugins = createServerFn()
    .inputValidator((input: { server: string }) => ({
        server: parseServerName(input.server),
    }))
    .handler(async ({ data }): Promise<PluginRow[]> => {
        const [installed, managed] = await Promise.all([
            fetchInstalledPlugins(data.server),
            fetchManagedOrEmpty(data.server),
        ]);

        return toPluginRows(installed, managed);
    });
