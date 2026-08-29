import type {
    InstalledPluginItem,
    ManagedPluginItem,
    PluginRow,
} from "../-types";

/**
 * 突き合わせのキー。
 *
 * MPM 自身が管理外の jar を消すときにプラグイン名を小文字にして比べており
 * (`PluginLifecycleServiceImpl` の `removeUnmanaged`)、`PluginName` 側にも
 * 正規化が無い。ここでも同じく大文字小文字を無視して突き合わせる
 */
const keyOf = (name: string): string => name.toLowerCase();

/**
 * 導入済みの一覧と MPM の一覧を突き合わせて、表の行を作る。
 *
 * 実際にサーバーに入っているものを軸にして、MPM の一覧に載っていれば
 * 最新バージョンなどを重ねる。載っていなければ「管理外」の行になる。
 *
 * 逆に MPM の一覧にだけあって jar が無いもの (`mpm.json` に残ったまま
 * ファイルが消えているなど) も、黙って落とさず末尾に足す。
 */
export const toPluginRows = (
    installed: InstalledPluginItem[],
    managed: ManagedPluginItem[],
): PluginRow[] => {
    const managedByName = new Map(
        managed.map((plugin) => [keyOf(plugin.name), plugin]),
    );

    const rows: PluginRow[] = installed.map((plugin) => {
        const match = managedByName.get(keyOf(plugin.name));

        if (!match) {
            return {
                name: plugin.name,
                currentVersion: plugin.version,
                isManaged: false,
                description: plugin.description,
            };
        }

        return {
            // 表示名は MPM 側に合わせる。更新操作の宛先と一致する方が分かりやすい
            name: match.name,
            // バージョンは実際に入っている値を優先する
            currentVersion: plugin.version || match.currentVersion,
            isManaged: true,
            latestVersion: match.latestVersion,
            isOutdated: match.isOutdated,
            isLocked: match.isLocked,
            description: match.description ?? plugin.description,
        };
    });

    const installedNames = new Set(
        installed.map((plugin) => keyOf(plugin.name)),
    );
    const missing = managed
        .filter((plugin) => !installedNames.has(keyOf(plugin.name)))
        .map(
            (plugin): PluginRow => ({
                name: plugin.name,
                // jar が見つからないので、入っているバージョンは無い
                currentVersion: null,
                isManaged: true,
                latestVersion: plugin.latestVersion,
                isOutdated: plugin.isOutdated,
                isLocked: plugin.isLocked,
                description: plugin.description,
            }),
        );

    return [...rows, ...missing];
};
