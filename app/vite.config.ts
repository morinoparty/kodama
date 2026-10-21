import fs from "node:fs";
import path from "node:path";
import { cloudflare } from "@cloudflare/vite-plugin";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

// storybook パッケージのビルド成果物 (storybook-static) を
// client のアセットとして /storybook/ 配下に同梱する。
// cf build / cf previews deploy は package の scripts を通らず Vite を直接動かすため、
// コピーは Vite のプラグインで行う (Storybook 自体は事前に pnpm run build:storybook でビルドしておく)
const storybookDir = path.resolve(
    import.meta.dirname,
    "../storybook/storybook-static",
);
const bundleStorybook = (): Plugin => ({
    name: "kodama:bundle-storybook",
    apply: "build",
    applyToEnvironment: (environment) => environment.name === "client",
    writeBundle() {
        if (!fs.existsSync(storybookDir)) {
            const message = `${storybookDir} が見つからないため Storybook を同梱できません (pnpm run build:storybook を先に実行してください)`;
            // CI では Storybook 抜きでデプロイされないよう失敗させる
            if (process.env.CI) this.error(message);
            this.warn(message);
            return;
        }
        const outDir = path.resolve(
            this.environment.config.root,
            this.environment.config.build.outDir,
            "storybook",
        );
        fs.cpSync(storybookDir, outDir, { recursive: true });
    },
});

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
        bundleStorybook(),
    ],
});

export default config;
