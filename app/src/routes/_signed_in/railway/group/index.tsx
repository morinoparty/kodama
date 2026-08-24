import {
    createFileRoute,
    type ErrorComponentProps,
} from "@tanstack/react-router";
import { RailwayPage } from "../-components/railway-page";
import { getGroups } from "./-api/get-groups";
import { GroupsTable } from "./-components/groups-table";

export const Route = createFileRoute("/_signed_in/railway/group/")({
    loader: () => getGroups(),
    component: RailwayGroupPage,
    // グループの取得に失敗しても画面全体が落ちないよう、ここで受け止める
    errorComponent: RailwayGroupErrorPage,
    // パンくずの段。階層は一致した route の並びから自動で決まるので、
    // ここでは自分の段だけを名乗る (lib/breadcrumbs.ts を参照)
    staticData: {
        breadcrumbs: [{ label: "鉄道" }, { label: "グループ" }],
    },
});

const TITLE = "鉄道グループ一覧";
const DESCRIPTION = "AdvanceRailway に登録されている路線グループの一覧です。";

function RailwayGroupPage() {
    const { groups } = Route.useLoaderData();

    return (
        <RailwayPage title={TITLE} description={DESCRIPTION}>
            <GroupsTable data={groups} />
        </RailwayPage>
    );
}

function RailwayGroupErrorPage({ error }: ErrorComponentProps) {
    return (
        <RailwayPage title={TITLE} description={DESCRIPTION}>
            <RailwayPage.LoadError resourceLabel="グループ情報" error={error} />
        </RailwayPage>
    );
}
