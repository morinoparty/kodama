import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { getAuth } from "../auth";

// サーバー関数のコンテキストには request が含まれないため、
// リクエストスコープの getRequest() からヘッダーを取り出して Better Auth に渡す
export const getSession = createServerFn().handler(async () => {
    const auth = await getAuth();
    const session = await auth.api.getSession({
        headers: getRequest().headers,
    });
    return session;
});

export type SessionData = Awaited<ReturnType<typeof getSession>>;
