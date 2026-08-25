import { createFileRoute } from "@tanstack/react-router";
import { css } from "styled-system/css";
import { getUserInfo } from "./-functions/get-user-info";

export const Route = createFileRoute("/_signed_in/")({
    loader: () => getUserInfo(),
    component: HomePage,
    // ユーザー情報の取得に失敗しても、画面全体が落ちないようここで受け止める
    errorComponent: UserInfoErrorPage,
    // パンくずの段。階層は一致した route の並びから自動で決まるので、
    // ここでは自分の段だけを名乗る (lib/breadcrumbs.ts を参照)
    staticData: {
        breadcrumbs: [{ label: "ホーム" }],
    },
});

const pageStyle = css({
    display: "flex",
    flexDirection: "column",
    gap: "6",
    maxWidth: "4xl",
    mx: "auto",
    px: { base: "4", sm: "6" },
    py: { base: "8", sm: "12" },
});

const headingStyle = css({
    textStyle: "3xl",
    fontWeight: "bold",
    color: "fg",
});

const leadStyle = css({
    textStyle: "sm",
    color: "fg.muted",
    maxWidth: "prose",
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

const cardLabelStyle = css({
    textStyle: "xs",
    fontWeight: "semibold",
    color: "fg.subtle",
});

const profileStyle = css({
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "4",
});

const avatarStyle = css({
    width: "16",
    height: "16",
    borderRadius: "lg",
    flexShrink: "0",
    bg: "colorPalette.bg.subtle",
});

const userNameStyle = css({
    textStyle: "xl",
    fontWeight: "bold",
    color: "fg",
});

const roleListStyle = css({
    display: "flex",
    flexWrap: "wrap",
    gap: "2",
    mt: "2",
});

const roleStyle = css({
    px: "2",
    py: "0.5",
    borderRadius: "full",
    textStyle: "xs",
    fontWeight: "medium",
    bg: "colorPalette.bg.subtle",
    color: "colorPalette.fg",
});

const noRoleStyle = css({
    textStyle: "sm",
    color: "fg.muted",
});

function HomePage() {
    const userInfo = Route.useLoaderData();

    return (
        <div className={pageStyle}>
            <div>
                <h1 className={headingStyle}>Kodama</h1>
                <p className={leadStyle}>
                    もりのパーティのサーバーを管理するための運営ツールです。
                    左のメニューから各機能を開いてください。
                </p>
            </div>

            <section className={cardStyle}>
                <p className={cardLabelStyle}>ログイン中のアカウント</p>
                <div className={profileStyle}>
                    <img
                        src={userInfo.picture}
                        alt=""
                        width={64}
                        height={64}
                        className={avatarStyle}
                    />
                    <div>
                        <p className={userNameStyle}>
                            {userInfo.preferred_username}
                        </p>
                        {userInfo.roles.length > 0 ? (
                            <ul className={roleListStyle}>
                                {userInfo.roles.map((role) => (
                                    <li key={role} className={roleStyle}>
                                        {role}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className={noRoleStyle}>ロールなし</p>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}

function UserInfoErrorPage() {
    return (
        <div className={pageStyle}>
            <div>
                <h1 className={headingStyle}>Kodama</h1>
                <p className={leadStyle}>
                    もりのパーティのサーバーを管理するための運営ツールです。
                </p>
            </div>
            <section className={cardStyle}>
                <p className={cardLabelStyle}>ログイン中のアカウント</p>
                <p className={noRoleStyle}>
                    ユーザー情報を取得できませんでした。時間をおいて再読み込みしてください。
                </p>
            </section>
        </div>
    );
}
