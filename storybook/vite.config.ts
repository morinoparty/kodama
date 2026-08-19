import path from "node:path";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    resolve: {
        alias: {
            // app パッケージのソースを Storybook から参照するための alias
            "@": path.resolve(import.meta.dirname, "../app/src"),
            "#": path.resolve(import.meta.dirname, "../app/src"),
            // @morinoparty/chlorophyll-react が bare specifier で
            // styled-system/recipes を参照するため、Storybook 側の outdir に解決する
            "styled-system": path.resolve(import.meta.dirname, "styled-system"),
        },
    },
    // @morinoparty/chlorophyll-react は生の TSX を配布しているため、
    // dep optimizer (esbuild) の JSX 変換を automatic にする
    optimizeDeps: {
        esbuildOptions: {
            jsx: "automatic",
        },
    },
    base: "./",
    plugins: [viteReact()],
});
