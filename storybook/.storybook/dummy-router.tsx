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

const StoryContext = createContext<(() => ReactNode) | undefined>(undefined);
const RenderStory = () => {
    const storyFn = useContext(StoryContext);
    if (!storyFn) {
        throw new Error("Storybook root not found");
    }
    return storyFn();
};

// アプリで実在するパスを列挙する。ここに無いパスへの Link は解決できない
const paths = ["/", "/auth/sign-in"];
const routes = paths.map((path) =>
    createRoute({
        path,
        getParentRoute: () => rootRoute,
        component: RenderStory,
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
