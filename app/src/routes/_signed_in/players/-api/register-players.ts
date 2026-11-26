import { createServerFn } from "@tanstack/react-start";
import { staffMiddleware } from "@/lib/staff-middleware";
import {
    registerBatchInputSchema,
    registerOneInputSchema,
} from "../-functions/player-input";
import type { RegisterResult } from "../-types";
import { McApiError, postPlayersBatch, putPlayer } from "./mc-api";

/** 失敗の原因を、画面にそのまま出せる文言にする */
const messageOf = (error: unknown): string =>
    error instanceof Error ? error.message : "原因不明のエラーです";

/**
 * 1 人を mc-api に登録・更新する。
 *
 * - staffMiddleware で運営ロールをサーバー側で確かめてから、共有の secret を使う
 * - 入力は Zod で検証・正規化する (クライアント側の検証は表示のためだけ)
 * - 失敗しても例外にはせず、結果の 1 行として返す。画面全体を落とさず、
 *   どの UUID がなぜ失敗したかを一覧で見せるため
 */
export const registerPlayer = createServerFn({ method: "POST" })
    .middleware([staffMiddleware])
    .inputValidator(registerOneInputSchema)
    .handler(async ({ data }): Promise<RegisterResult> => {
        try {
            const result = await putPlayer(data.uuid);
            return {
                uuid: result.uuid,
                status: result.status,
                name: result.name,
            };
        } catch (error) {
            // PUT の 404 は「Mojang に存在しない UUID なので登録しなかった」。
            // MC_API_URL の誤りでも 404 になりうるので、mc-api のエラー文も残して見分けられるようにする
            if (error instanceof McApiError && error.status === 404) {
                return {
                    uuid: data.uuid,
                    status: "not_found",
                    name: null,
                    message: error.message,
                };
            }
            return {
                uuid: data.uuid,
                status: "error",
                name: null,
                message: messageOf(error),
            };
        }
    });

/**
 * まとめて mc-api に登録する (最大 100 件)。
 *
 * 一括登録の応答には名前が含まれないため、結果の name は常に null になる。
 * リクエスト自体が失敗したときは、送ったすべての UUID を `error` の行として返す
 */
export const registerPlayers = createServerFn({ method: "POST" })
    .middleware([staffMiddleware])
    .inputValidator(registerBatchInputSchema)
    .handler(async ({ data }): Promise<RegisterResult[]> => {
        try {
            const { results } = await postPlayersBatch(data.uuids, data.fetch);
            return results.map((result) => ({
                uuid: result.uuid,
                status: result.status,
                name: null,
            }));
        } catch (error) {
            const message = messageOf(error);
            return data.uuids.map((uuid) => ({
                uuid,
                status: "error",
                name: null,
                message,
            }));
        }
    });
