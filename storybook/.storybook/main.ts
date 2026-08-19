import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";

const shim = (name: string) =>
    fileURLToPath(new URL(`./shims/${name}.ts`, import.meta.url));

const config: StorybookConfig = {
    stories: ["../stories/**/*.stories.tsx"],
    addons: ["@storybook/addon-a11y", "@storybook/addon-docs"],
    framework: {
        name: "@storybook/react-vite",
        options: {
            builder: {
                viteConfigPath: "vite.config.ts",
            },
        },
    },
    viteFinal: async (config) => {
        // chlorophyll は生の TSX を配布しているため JSX 変換を automatic にする
        config.esbuild = { ...config.esbuild, jsx: "automatic" };
        config.optimizeDeps = {
            ...config.optimizeDeps,
            exclude: [
                ...(config.optimizeDeps?.exclude ?? []),
                "cloudflare:workers",
            ],
        };
        config.resolve = {
            ...(config.resolve ?? {}),
            alias: {
                ...(config.resolve?.alias ?? {}),
                // TanStack Start の内部/仮想モジュールと Workers ランタイム API は
                // ブラウザ向けバンドルでは解決できないため、スタブへ差し替える
                "#tanstack-router-entry": shim("tanstack-router-entry"),
                "#tanstack-start-entry": shim("tanstack-start-entry"),
                "tanstack-start-manifest:v": shim("tanstack-start-manifest"),
                "tanstack-start-injected-head-scripts:v": shim(
                    "tanstack-start-injected-head-scripts",
                ),
                "@tanstack/router-core/ssr/server": shim(
                    "tanstack-router-core-ssr-server",
                ),
                "@tanstack/react-router/ssr/server": shim(
                    "tanstack-react-router-ssr-server",
                ),
                "node:async_hooks": shim("async-hooks"),
                "cloudflare:workers": shim("cloudflare-workers"),
            },
        };
        return config;
    },
};

export default config;
