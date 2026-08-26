import {
    createFileRoute,
    type ErrorComponentProps,
} from "@tanstack/react-router";
import { RailwayPage } from "../-components/railway-page";
import { getStations } from "./-api/get-stations";
import { StationsTable } from "./-components/stations-table";

export const Route = createFileRoute("/_signed_in/railway/station/")({
    loader: () => getStations(),
    component: StationPage,
    // 駅の取得に失敗しても画面全体が落ちないよう、ここで受け止める
    errorComponent: StationErrorPage,
    // パンくずの段。階層は一致した route の並びから自動で決まるので、
    // ここでは自分の段だけを名乗る (lib/breadcrumbs.ts を参照)
    staticData: {
        breadcrumbs: [{ label: "鉄道" }, { label: "駅" }],
    },
});

const TITLE = "駅一覧";
const DESCRIPTION =
    "AdvanceRailway に登録されている駅の一覧です。グループに足した駅はそのグループの末尾に付くので、並び順はグループの詳細ページで整えてください。";

function StationPage() {
    const { stations, groups } = Route.useLoaderData();

    return (
        <RailwayPage title={TITLE} description={DESCRIPTION}>
            <StationsTable data={stations} groups={groups} />
        </RailwayPage>
    );
}

function StationErrorPage({ error }: ErrorComponentProps) {
    return (
        <RailwayPage title={TITLE} description={DESCRIPTION}>
            <RailwayPage.LoadError resourceLabel="駅情報" error={error} />
        </RailwayPage>
    );
}
