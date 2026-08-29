import { createServerFn } from "@tanstack/react-start";
import { parseServerName } from "@/lib/plugin-api";
import type { PluginItem } from "../-types";
import { fetchPlugins } from "./mpm";

/**
 * 指定したサーバーのプラグイン一覧を取得する。
 *
 * サーバー名はクライアントから渡ってきて URL の一部になるため、
 * `parseServerName` で既知の名前だけに絞ってから使う。
 */
export const getPlugins = createServerFn()
    .inputValidator((input: { server: string }) => ({
        server: parseServerName(input.server),
    }))
    .handler(({ data }): Promise<PluginItem[]> => fetchPlugins(data.server));
