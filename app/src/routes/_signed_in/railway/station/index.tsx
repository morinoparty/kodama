import {
    createFileRoute,
    type ErrorComponentProps,
} from "@tanstack/react-router";
import { css } from "styled-system/css";
import { StationsTable } from "./-components/stations-table";
import { getStations } from "./-functions/get-stations";

export const Route = createFileRoute("/_signed_in/railway/station/")({
    loader: () => getStations(),
    component: StationPage,
    errorComponent: StationErrorPage,
    staticData: {
        breadcrumbs: [{ label: "鉄道" }, { label: "駅" }],
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

function StationPage() {
    const data = Route.useLoaderData();

    return (
        <div className={pageStyle}>
            <div className={headerStyle}>
                <h1 className={headingStyle}>駅一覧</h1>
                <p className={leadStyle}>
                    AdvanceRailway に登録されている駅の一覧です。
                </p>
            </div>

            <StationsTable data={data.stations} />
        </div>
    );
}

function StationErrorPage({ error }: ErrorComponentProps) {
    return (
        <div className={pageStyle}>
            <div className={headerStyle}>
                <h1 className={headingStyle}>駅一覧</h1>
                <p className={leadStyle}>
                    AdvanceRailway に登録されている駅の一覧です。
                </p>
            </div>
            <section className={cardStyle}>
                <p className={errorTextStyle}>駅情報の取得に失敗しました。</p>
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
