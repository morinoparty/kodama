import {
    createFileRoute,
    type ErrorComponentProps,
} from "@tanstack/react-router";
import { RailwayPage } from "../-components/railway-page";
import { getRailways } from "./-api/get-railways";
import { RailwaysTable } from "./-components/railways-table";

export const Route = createFileRoute("/_signed_in/railway/railway/")({
    loader: () => getRailways(),
    component: RailwayListPage,
    // 路線の取得に失敗しても画面全体が落ちないよう、ここで受け止める
    errorComponent: RailwayListErrorPage,
    // パンくずの段。階層は一致した route の並びから自動で決まるので、
    // ここでは自分の段だけを名乗る (lib/breadcrumbs.ts を参照)
    staticData: {
        breadcrumbs: [{ label: "鉄道" }, { label: "路線" }],
    },
});

const TITLE = "路線一覧";
const DESCRIPTION = "AdvanceRailway に登録されている路線・運行区間の一覧です。";

function RailwayListPage() {
    const { railways, groups } = Route.useLoaderData();

    return (
        <RailwayPage title={TITLE} description={DESCRIPTION}>
            <RailwaysTable data={railways} groups={groups} />
        </RailwayPage>
    );
}

function RailwayListErrorPage({ error }: ErrorComponentProps) {
    return (
        <RailwayPage title={TITLE} description={DESCRIPTION}>
            <RailwayPage.LoadError resourceLabel="路線情報" error={error} />
        </RailwayPage>
    );
}
