import { defineConfig } from "@pandacss/dev";
// app 側の Panda 設定 (preset / staticCss) をそのまま流用し、
// 抽出対象と出力先だけ Storybook 用に差し替える
import appConfig from "../app/panda.config";

export default defineConfig({
    ...appConfig,
    include: [
        "./stories/**/*.{ts,tsx}",
        "./.storybook/**/*.{ts,tsx}",
        "../app/src/**/*.{ts,tsx}",
    ],
    outdir: "styled-system",
});
