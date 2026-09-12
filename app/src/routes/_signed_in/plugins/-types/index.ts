// プラグイン一覧に使う型。
//
// 3 つの API を突き合わせて 1 つの表を作る。
// - MPM (`/api/v1/plugins/mpm/plugins`) — MPM が管理しているプラグインと、記録済みの最新バージョン
// - MPM (`/api/v1/plugins/mpm/plugins/outdated`) — 上流に問い合わせ直した更新チェックの結果
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
    /** 実際に入っているバージョン。メタデータを読めないエントリでは null */
    readonly currentVersion: string | null;
    /**
     * MPM が最後に記録した最新バージョン。メタデータを読めないエントリでは null。
     *
     * これはメタデータの読み出しに過ぎず、`mpm.json` の Fixed 指定 (pin / rollback での
     * バージョン固定) は加味されていない。実際の更新先は更新チェックの結果を見ること
     */
    readonly latestVersion: string | null;
    /** 最新でないか。上と同じくメタデータ由来で、Fixed 指定は加味されていない */
    readonly isOutdated: boolean;
    /** 更新を止めているか */
    readonly isLocked: boolean;
    readonly description?: string | null;
}

/**
 * 更新チェックが取れたプラグイン 1 つ分。
 *
 * MPM 側で上流に問い合わせ直し、`mpm.json` の Fixed / Tag / Sync 指定まで踏まえて
 * 「更新したら実際に入るバージョン」を `latestVersion` として返す
 */
export interface OutdatedPluginItem {
    readonly name: string;
    readonly currentVersion: string;
    /** 更新先として実際に使われるバージョン */
    readonly latestVersion: string;
    /** 更新が必要か。正規化したバージョン同士の比較結果 */
    readonly needsUpdate: boolean;
}

/** 更新チェックに失敗したプラグイン 1 つ分 */
export interface PluginCheckErrorItem {
    readonly name: string;
    readonly errorMessage: string;
}

/**
 * 更新チェックの結果。
 *
 * チェックはプラグインごとに上流へ問い合わせるため、一部だけ失敗しうる。
 * 失敗したものを「最新」と見せないよう、成功分と失敗分を分けて返ってくる
 */
export interface OutdatedCheckResult {
    readonly outdated: OutdatedPluginItem[];
    readonly errors: PluginCheckErrorItem[];
}

/**
 * 最新バージョンがどこから来た値か。
 *
 * 更新チェックが取れていない値を「更新あり」として強調すると、MPM の記録が古いときに
 * ありもしないダウングレードを勧めてしまう。由来を持たせて表示を分ける
 */
export type LatestVersionCheck =
    /** 更新チェックが取れた。Fixed 指定まで踏まえた実際の更新先 */
    | "checked"
    /** このプラグインのチェックだけ失敗した。値は MPM の記録のまま */
    | "failed"
    /** 更新チェック自体が取れなかった。値は MPM の記録のまま */
    | "unchecked";

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
    /** 更新先のバージョン。MPM の一覧に載っているものだけ */
    readonly latestVersion?: string;
    /** 上の値の由来。MPM の一覧に載っているものだけ */
    readonly latestCheck?: LatestVersionCheck;
    /** 最新でないか。更新チェックが取れたときだけ持つ */
    readonly isOutdated?: boolean;
    /** 更新チェックに失敗した理由。`latestCheck` が `"failed"` のときだけ持つ */
    readonly checkError?: string;
    readonly isLocked?: boolean;
    readonly description?: string | null;
}
