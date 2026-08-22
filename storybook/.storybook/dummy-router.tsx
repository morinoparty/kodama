// Storybook で TanStack Router の Link を動かすためのダミールーター。
// story はルーターの外側にあるため、そのままだと Link が
// 「ルーターが見つからない」で落ちてしまう。
// ここではメモリ履歴のルーターを 1 つ用意し、story 自体を
// 各ルートの component として描画することで Link を成立させている。

import {
    createMemoryHistory,
    createRootRoute,
    createRoute,
    createRouter,
    RouterProvider,
} from "@tanstack/react-router";
import { createContext, type ReactNode, useContext } from "react";
import type { Breadcrumb } from "@/lib/breadcrumbs";

const StoryContext = createContext<(() => ReactNode) | undefined>(undefined);
const RenderStory = () => {
    const storyFn = useContext(StoryContext);
    if (!storyFn) {
        throw new Error("Storybook root not found");
    }
    return storyFn();
};

// アプリで実在するパス。ここに無いパスへの Link は解決できない
const APP_PATHS = ["/", "/auth/sign-in"] as const;

// アプリにはまだ無いが、階層のあるパンくずを story で見せるための仮のパス。
// 実際のページが増えたらこちらから APP_PATHS へ移す
const STORY_PATHS = ["/plugins", "/rail", "/rail/lines"] as const;

const paths = [...APP_PATHS, ...STORY_PATHS];

// パンくず (AppBreadcrumb) は route の staticData から組み立てるので、
// story でもアプリと同じ形で段を持たせておく
const BREADCRUMBS: Record<
    (typeof APP_PATHS | typeof STORY_PATHS)[number],
    readonly Breadcrumb[]
> = {
    "/": [{ label: "ホーム" }],
    "/auth/sign-in": [{ label: "サインイン" }],
    "/plugins": [{ label: "プラグイン" }],
    "/rail": [{ label: "鉄道" }],
    "/rail/lines": [{ label: "鉄道", to: "/rail" }, { label: "路線" }],
};

const routes = paths.map((path) =>
    createRoute({
        path,
        getParentRoute: () => rootRoute,
        component: RenderStory,
        staticData: { breadcrumbs: BREADCRUMBS[path] },
    }),
);

const rootRoute = createRootRoute();
rootRoute.addChildren(routes);

const storyRouter = createRouter({
    history: createMemoryHistory({ initialEntries: ["/"] }),
    routeTree: rootRoute,
});

export const withDummyRouter =
    (initialPath: (typeof paths)[number]) => (storyFn: () => ReactNode) => {
        storyRouter.history.push(initialPath);
        return (
            <StoryContext.Provider value={storyFn}>
                <RouterProvider router={storyRouter} />
            </StoryContext.Provider>
        );
    };
