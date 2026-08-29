// MPM (もりのパーティのプラグインマネージャー) の API のレスポンス型。
// 各サーバーの `/api/v1/plugins/mpm/plugins` が返す 1 件分にあたる。

/**
 * サーバーに導入されているプラグイン 1 つ分
 */
export interface PluginItem {
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
