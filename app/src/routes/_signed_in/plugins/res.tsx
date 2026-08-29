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
const DESCRIPTION =
    "資源サーバー (res) に MPM で導入されているプラグインと、そのバージョンの一覧です。";

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
