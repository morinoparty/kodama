import { createFileRoute } from "@tanstack/react-router";
import { css } from "styled-system/css";
import { RailwaysTable } from "./-components/railways-table";
import { getRailways } from "./-functions/get-railways";

export const Route = createFileRoute("/_signed_in/railway/railway/")({
    loader: () => getRailways(),
    component: RailwayPage,
    errorComponent: RailwayErrorPage,
    staticData: {
        breadcrumbs: [{ label: "鉄道" }, { label: "路線" }],
    },
});

const pageStyle = css({
    display: "flex",
    flexDirection: "column",
    gap: "6",
    maxWidth: "7xl",
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

function RailwayPage() {
    const data = Route.useLoaderData();

    return (
        <div className={pageStyle}>
            <div className={headerStyle}>
                <h1 className={headingStyle}>路線一覧</h1>
                <p className={leadStyle}>
                    AdvanceRailway に登録されている路線・運行区間の一覧です。
                </p>
            </div>

            <RailwaysTable data={data.railways} />
        </div>
    );
}

function RailwayErrorPage() {
    return (
        <div className={pageStyle}>
            <div className={headerStyle}>
                <h1 className={headingStyle}>路線一覧</h1>
                <p className={leadStyle}>
                    AdvanceRailway に登録されている路線・運行区間の一覧です。
                </p>
            </div>
            <section className={cardStyle}>
                <p className={errorTextStyle}>
                    路線情報の取得に失敗しました。時間をおいて再読み込みしてください。
                </p>
            </section>
        </div>
    );
}
