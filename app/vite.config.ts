import path from "node:path";
import { cloudflare } from "@cloudflare/vite-plugin";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const config = defineConfig({
    resolve: {
        tsconfigPaths: true,
        alias: {
            // @morinoparty/chlorophyll-react が bare specifier で
            // styled-system/recipes を参照するため、Panda の outdir に解決する
            "styled-system": path.resolve(import.meta.dirname, "styled-system"),
        },
    },
    // @morinoparty/chlorophyll-react は生の TSX を配布しているため、
    // dep optimizer (esbuild) の JSX 変換を automatic にしないと
    // SSR で `React is not defined` になる
    optimizeDeps: {
        esbuildOptions: {
            jsx: "automatic",
        },
    },
    ssr: {
        optimizeDeps: {
            esbuildOptions: {
                jsx: "automatic",
            },
        },
    },
    plugins: [
        devtools(),
        cloudflare({ viteEnvironment: { name: "ssr" } }),
        tanstackStart(),
        viteReact(),
    ],
});

export default config;
