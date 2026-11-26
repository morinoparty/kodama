import { Button } from "@morinoparty/chlorophyll-react";
import {
    createFileRoute,
    type ErrorComponentProps,
} from "@tanstack/react-router";
import { useState } from "react";
import { css } from "styled-system/css";
import { toaster } from "@/components/app-toaster";
import { ListPage } from "@/components/list-page";
import { checkStaff } from "@/lib/server-functions";
import { STAFF_ROLE } from "@/lib/staff";
import { registerPlayer, registerPlayers } from "./-api/register-players";
import { RegisterForm } from "./-components/register-form";
import {
    type RegisterResultRow,
    RegisterResultsTable,
} from "./-components/register-results-table";
import type { RegisterResult } from "./-types";

export const Route = createFileRoute("/_signed_in/players/")({
    // フォームを出すかどうかの判定だけに使う。
    // 実際の登録の可否はサーバー関数の staffMiddleware が判定する
    loader: () => checkStaff(),
    component: PlayersPage,
    // 権限の確認に失敗しても画面全体が落ちないよう、ここで受け止める
    errorComponent: PlayersErrorPage,
    // パンくずの段。階層は一致した route の並びから自動で決まるので、
    // ここでは自分の段だけを名乗る (lib/breadcrumbs.ts を参照)
    staticData: {
        breadcrumbs: [{ label: "プレイヤー" }, { label: "mc-api 登録" }],
    },
});

const TITLE = "mc-api へのプレイヤー登録";
const DESCRIPTION =
    "mc-api (プレイヤーのアバター・スキンを配る API) にプレイヤーを登録します。登録したプレイヤーだけが mc-api で参照できるようになります。UUID で入力してください。";

const sectionStyle = css({
    display: "flex",
    flexDirection: "column",
    gap: "3",
});

const sectionHeaderStyle = css({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "3",
});

const sectionTitleStyle = css({
    textStyle: "lg",
    fontWeight: "bold",
    color: "fg",
});

const noticeStyle = css({
    p: { base: "5", sm: "6" },
    borderRadius: "xl",
    bg: "bg.panel",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "border.subtle",
    textStyle: "sm",
    color: "fg.muted",
});

/** サーバー関数そのものが失敗した (権限・入力の検証など) ことを知らせる */
const notifyRegisterFailed = (error: unknown) =>
    toaster.create({
        type: "error",
        title: "登録できませんでした",
        description:
            error instanceof Error ? error.message : "原因不明のエラーです",
        closable: true,
    });

function PlayersPage() {
    const { isStaff } = Route.useLoaderData();
    const [rows, setRows] = useState<RegisterResultRow[]>([]);

    // 送った順に通し番号を振って表に足す。新しい結果ほど下に並ぶ
    const appendResults = (results: readonly RegisterResult[]) =>
        setRows((current) => [
            ...current,
            ...results.map((result, offset) => ({
                ...result,
                index: current.length + offset + 1,
            })),
        ]);

    const handleRegisterOne = async (uuid: string) => {
        try {
            appendResults([await registerPlayer({ data: { uuid } })]);
        } catch (error) {
            notifyRegisterFailed(error);
        }
    };

    const handleRegisterBatch = async (
        uuids: string[],
        fetchProfiles: boolean,
    ) => {
        try {
            appendResults(
                await registerPlayers({
                    data: { uuids, fetch: fetchProfiles },
                }),
            );
        } catch (error) {
            notifyRegisterFailed(error);
        }
    };

    if (!isStaff) {
        return (
            <ListPage title={TITLE} description={DESCRIPTION}>
                <p className={noticeStyle}>
                    この画面を使うには MineAuth の {STAFF_ROLE}{" "}
                    ロールが必要です。
                </p>
            </ListPage>
        );
    }

    return (
        <ListPage title={TITLE} description={DESCRIPTION}>
            <RegisterForm
                onRegisterOne={handleRegisterOne}
                onRegisterBatch={handleRegisterBatch}
            />
            <section className={sectionStyle}>
                <div className={sectionHeaderStyle}>
                    <h2 className={sectionTitleStyle}>登録結果</h2>
                    <Button
                        intent="secondary"
                        size="sm"
                        disabled={rows.length === 0}
                        onClick={() => setRows([])}
                    >
                        結果を消す
                    </Button>
                </div>
                <RegisterResultsTable rows={rows} />
            </section>
        </ListPage>
    );
}

function PlayersErrorPage({ error }: ErrorComponentProps) {
    return (
        <ListPage title={TITLE} description={DESCRIPTION}>
            <ListPage.LoadError resourceLabel="権限の情報" error={error} />
        </ListPage>
    );
}
