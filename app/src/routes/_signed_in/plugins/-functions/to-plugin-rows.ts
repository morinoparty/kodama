import type {
    InstalledPluginItem,
    ManagedPluginItem,
    OutdatedCheckResult,
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

/** 行のうち、最新バージョンにまつわる部分 */
type LatestVersionFields = Pick<
    PluginRow,
    "latestVersion" | "latestCheck" | "isOutdated" | "checkError"
>;

/**
 * MPM の一覧と更新チェックの結果から、最新バージョンの欄を決める。
 *
 * 一覧の `latestVersion` はメタデータの読み出しでしかなく、`mpm.json` の Fixed 指定
 * (pin / rollback での固定) を反映しない。そのため、記録が古いまま上流が巻き戻ると
 * 「1.7.3 -> 1.6.6」のようなダウングレードを勧めてしまう。
 * 更新チェックが取れたときはそちらを正とし、取れなかったときは記録値を出しつつ
 * 「更新あり」とは言い切らない。
 */
const toLatestVersionFields = (
    managed: ManagedPluginItem,
    checked: OutdatedCheckResult | null,
): LatestVersionFields => {
    const key = keyOf(managed.name);
    const outdated = checked?.outdated.find((item) => keyOf(item.name) === key);

    if (outdated) {
        return {
            latestVersion: outdated.latestVersion,
            latestCheck: "checked",
            isOutdated: outdated.needsUpdate,
        };
    }

    // 記録値はあくまで参考値として残す。null は「メタデータを読めなかった」なので落とす
    const recorded = managed.latestVersion ?? undefined;
    const error = checked?.errors.find((item) => keyOf(item.name) === key);

    if (error) {
        return {
            latestVersion: recorded,
            latestCheck: "failed",
            checkError: error.errorMessage,
        };
    }

    // チェック自体が取れなかったか、チェックの対象外だったもの
    return { latestVersion: recorded, latestCheck: "unchecked" };
};

/**
 * 導入済みの一覧と MPM の一覧を突き合わせて、表の行を作る。
 *
 * 実際にサーバーに入っているものを軸にして、MPM の一覧に載っていれば
 * 最新バージョンなどを重ねる。載っていなければ「管理外」の行になる。
 *
 * 逆に MPM の一覧にだけあって jar が無いもの (`mpm.json` に残ったまま
 * ファイルが消えているなど) も、黙って落とさず末尾に足す。
 *
 * @param checked 更新チェックの結果。取れなかった場合は null
 */
export const toPluginRows = (
    installed: InstalledPluginItem[],
    managed: ManagedPluginItem[],
    checked: OutdatedCheckResult | null,
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
            ...toLatestVersionFields(match, checked),
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
                ...toLatestVersionFields(plugin, checked),
                isLocked: plugin.isLocked,
                description: plugin.description,
            }),
        );

    return [...rows, ...missing];
};
