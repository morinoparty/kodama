import {
    createFileRoute,
    type ErrorComponentProps,
} from "@tanstack/react-router";
import { ListPage } from "@/components/list-page";
import { getGroupDetail } from "./-api/get-group-detail";
import { GroupStationsTable } from "./-components/group-stations-table";

export const Route = createFileRoute("/_signed_in/railway/group/$id")({
    loader: async ({ params }) => {
        const { group, stations } = await getGroupDetail({
            data: { id: params.id },
        });

        return {
            group,
            stations,
            // グループ名は読み込むまで決まらないので、パンくずは loader から名乗る。
            // 一覧とは兄弟のルートなので、上の段もここでまとめて返す
            breadcrumbs: [
                { label: "鉄道" },
                { label: "グループ", to: "/railway/group" },
                { label: group.name },
            ],
        };
    },
    component: RailwayGroupDetailPage,
    // グループの取得に失敗しても画面全体が落ちないよう、ここで受け止める
    errorComponent: RailwayGroupDetailErrorPage,
});

const DESCRIPTION =
    "駅の並び順がそのまま駅ナンバリングになります。上下に動かすと、後ろの駅の番号も付け直されます。";

function RailwayGroupDetailPage() {
    const { group, stations } = Route.useLoaderData();

    return (
        <ListPage title={group.name} description={DESCRIPTION}>
            <GroupStationsTable groupId={group.id} stations={stations} />
        </ListPage>
    );
}

function RailwayGroupDetailErrorPage({ error }: ErrorComponentProps) {
    return (
        // 読み込めていないのでグループ名は出せない。見出しは固定の文言にする
        <ListPage title="鉄道グループ" description={DESCRIPTION}>
            <ListPage.LoadError resourceLabel="グループ情報" error={error} />
        </ListPage>
    );
}
