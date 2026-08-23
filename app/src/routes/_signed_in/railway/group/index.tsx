import {
    createFileRoute,
    type ErrorComponentProps,
} from "@tanstack/react-router";
import { css } from "styled-system/css";
import { GroupsTable } from "./-components/groups-table";
import { getGroups } from "./-functions/get-groups";

export const Route = createFileRoute("/_signed_in/railway/group/")({
    loader: () => getGroups(),
    component: RailwayGroupPage,
    errorComponent: RailwayGroupErrorPage,
    staticData: {
        breadcrumbs: [{ label: "鉄道" }, { label: "グループ" }],
    },
});

const pageStyle = css({
    display: "flex",
    flexDirection: "column",
    gap: "6",
    maxWidth: "5xl",
    mx: "auto",
    px: { base: "4", sm: "6" },
    py: { base: "8", sm: "12" },
});

const headerStyle = css({
    display: "flex",
    flexDirection: "column",
    gap: "1",
});

const headingStyle = css({
    textStyle: "2xl",
    fontWeight: "bold",
    color: "fg",
});

const leadStyle = css({
    textStyle: "sm",
    color: "fg.muted",
});

const cardStyle = css({
    display: "flex",
    flexDirection: "column",
    gap: "4",
    p: { base: "5", sm: "6" },
    borderRadius: "xl",
    bg: "bg.panel",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "border.subtle",
    boxShadow: "sm",
});

const errorTextStyle = css({
    textStyle: "sm",
    color: "fg.muted",
});

function RailwayGroupPage() {
    const data = Route.useLoaderData();

    return (
        <div className={pageStyle}>
            <div className={headerStyle}>
                <h1 className={headingStyle}>鉄道グループ一覧</h1>
                <p className={leadStyle}>
                    AdvanceRailway に登録されている路線グループの一覧です。
                </p>
            </div>

            <GroupsTable data={data.groups} />
        </div>
    );
}

function RailwayGroupErrorPage({ error }: ErrorComponentProps) {
    return (
        <div className={pageStyle}>
            <div className={headerStyle}>
                <h1 className={headingStyle}>鉄道グループ一覧</h1>
                <p className={leadStyle}>
                    AdvanceRailway に登録されている路線グループの一覧です。
                </p>
            </div>
            <section className={cardStyle}>
                <p className={errorTextStyle}>
                    グループ情報の取得に失敗しました。
                </p>
                {error?.message ? (
                    <p
                        className={css({
                            textStyle: "xs",
                            color: "fg.subtle",
                            fontFamily: "mono",
                            bg: "bg.muted",
                            p: "3",
                            borderRadius: "md",
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-all",
                        })}
                    >
                        {error.message}
                    </p>
                ) : null}
            </section>
        </div>
    );
}
