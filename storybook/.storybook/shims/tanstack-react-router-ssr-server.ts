/**
 * `@tanstack/react-router/ssr/server` の Storybook 向けスタブ。
 *
 * 本物は `@tanstack/router-core/ssr/server` を再エクスポートしたうえで、
 * Node のストリームを使う描画関数を足している。Storybook では SSR を
 * 実行しないため、core 側のスタブを再エクスポートして描画関数だけ差し替える。
 */
export * from "./tanstack-router-core-ssr-server";

const unavailable = (name: string) => () => {
    throw new Error(`${name} is not available in Storybook`);
};

export const RouterServer = unavailable("RouterServer");
export const defaultRenderHandler = unavailable("defaultRenderHandler");
export const defaultStreamHandler = unavailable("defaultStreamHandler");
export const renderRouterToStream = unavailable("renderRouterToStream");
export const renderRouterToString = unavailable("renderRouterToString");
