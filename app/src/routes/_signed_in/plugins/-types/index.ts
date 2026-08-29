// プラグイン一覧に使う型。
//
// 2 つの API を突き合わせて 1 つの表を作る。
// - MPM (`/api/v1/plugins/mpm/plugins`) — MPM が管理しているプラグインと、その最新バージョン
// - MineAuth コア (`/api/v1/commons/server/plugins`) — 実際にサーバーに入っている全プラグイン

/**
 * MPM が管理しているプラグイン 1 つ分。
 *
 * MPM は `mpm.json` に登録されたものだけを返し、`unmanaged` として登録された
 * エントリは一覧から除かれる。つまりこれは「サーバーに入っているもの」ではなく
 * 「MPM が面倒を見ているもの」の一覧になる
 */
export interface ManagedPluginItem {
    readonly name: string;
    /** 実際に入っているバージョン */
    readonly currentVersion: string;
    /** 配布元にある最新バージョン */
    readonly latestVersion: string;
    /** 最新でないか。バージョン文字列の比較は MPM 側の判定に従う */
    readonly isOutdated: boolean;
    /** 更新を止めているか */
    readonly isLocked: boolean;
    readonly description?: string | null;
}

/**
 * サーバーに実際に入っているプラグイン 1 つ分。
 * MPM の管理下かどうかに関わらず、jar があれば返る
 */
export interface InstalledPluginItem {
    readonly name: string;
    readonly version: string;
    readonly description?: string | null;
}

/**
 * 表の 1 行。導入済みのものと、MPM にだけ載っているものを 1 つの型で扱う。
 *
 * MPM の一覧に載っていないものは最新バージョンが分からないため、
 * `latestVersion` などは持たない
 */
export interface PluginRow {
    readonly name: string;
    /** 入っているバージョン。jar が無く MPM にだけ載っている場合は null */
    readonly currentVersion: string | null;
    /** MPM の一覧に載っているか */
    readonly isManaged: boolean;
    /** 配布元にある最新バージョン。MPM の一覧に載っているものだけ */
    readonly latestVersion?: string;
    readonly isOutdated?: boolean;
    readonly isLocked?: boolean;
    readonly description?: string | null;
}
