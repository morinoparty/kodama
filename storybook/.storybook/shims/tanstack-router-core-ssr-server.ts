/**
 * `@tanstack/router-core/ssr/server` の Storybook 向けスタブ。
 *
 * このモジュールは Node のストリーム実装を引き込むため、ブラウザ向けに
 * バンドルする Storybook では解決できない。Storybook は SSR を実行しないので、
 * 呼ばれたら投げる / 何もしない実装に差し替えている。
 *
 * 本物の export が増えるとバンドル時に MISSING_EXPORT で落ちるので、
 * その場合はここに同名の export を足すこと。現在の一覧は
 * `node_modules/@tanstack/router-core/dist/esm/ssr/server.js` の末尾で確認できる。
 */

const unavailable = (name: string) => () => {
    throw new Error(`${name} is not available in Storybook`);
};

// --- SSR のレンダリング系。Storybook からは呼ばれない ---
export const transformReadableStreamWithRouter = unavailable(
    "transformReadableStreamWithRouter",
);
export const transformPipeableStreamWithRouter = unavailable(
    "transformPipeableStreamWithRouter",
);
export const transformStreamWithRouter = unavailable(
    "transformStreamWithRouter",
);
export const createRequestHandler = unavailable("createRequestHandler");
export const createSsrStreamResponse = unavailable("createSsrStreamResponse");
export const waitForRequest = unavailable("waitForRequest");

// --- モジュールの初期化時に参照されうるもの。落ちないよう最小限の実装にする ---
export const defineHandlerCallback = <T>(cb: T): T => cb;

export const attachRouterServerSsrUtils = () => {};

export const getOrigin = (request: { url?: string } | undefined) => {
    try {
        return request?.url ? new URL(request.url).origin : "";
    } catch {
        return "";
    }
};

export const getNormalizedURL = (request: { url?: string } | undefined) => {
    try {
        return request?.url ? new URL(request.url) : undefined;
    } catch {
        return undefined;
    }
};

// --- SSR レスポンスの受け渡し。Storybook にはリクエストが存在しない ---
export const bindSsrResponseToRequest = () => {};
export const disposeSsrResponse = () => {};
export const disposeSsrResponseDetached = () => {};
export const isSsrResponse = () => false;
export const normalizeSsrResponse = <T>(response: T): T => response;
export const replaceSsrResponse = () => {};
export const stripSsrResponseBody = <T>(response: T): T => response;

export default {};
