import {
    createFileRoute,
    type ErrorComponentProps,
} from "@tanstack/react-router";
import { ListPage } from "@/components/list-page";
import { getPlugins } from "./-api/get-plugins";
import { PluginsTable } from "./-components/plugins-table";

export const Route = createFileRoute("/_signed_in/plugins/res")({
    loader: () => getPlugins({ data: { server: "res" } }),
    component: ResPluginsPage,
    // プラグインの取得に失敗しても画面全体が落ちないよう、ここで受け止める
    errorComponent: ResPluginsErrorPage,
    // パンくずの段。階層は一致した route の並びから自動で決まるので、
    // ここでは自分の段だけを名乗る (lib/breadcrumbs.ts を参照)
    staticData: {
        breadcrumbs: [{ label: "プラグイン" }, { label: "資源" }],
    },
});

const TITLE = "資源サーバーのプラグイン";
// 「管理外」は「MPM の一覧に載っていない」という意味。mpm.json に登録されていない
// プラグインのほか、登録済みでもメタデータが壊れていると MPM の一覧から外れる
const DESCRIPTION =
    "資源サーバー (res) に導入されているプラグインの一覧です。MPM の一覧に載っていないものは「管理外」として、最新バージョンを空欄で表示します。";

function ResPluginsPage() {
    const plugins = Route.useLoaderData();

    return (
        <ListPage title={TITLE} description={DESCRIPTION}>
            <PluginsTable data={plugins} />
        </ListPage>
    );
}

function ResPluginsErrorPage({ error }: ErrorComponentProps) {
    return (
        <ListPage title={TITLE} description={DESCRIPTION}>
            <ListPage.LoadError resourceLabel="プラグイン情報" error={error} />
        </ListPage>
    );
}
