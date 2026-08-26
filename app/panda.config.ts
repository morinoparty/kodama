import { createPreset, stone } from "@morinoparty/chlorophyll-react/preset";
import { defineConfig } from "@pandacss/dev";

export default defineConfig({
    preflight: true,

    // Chlorophyll の preset がデザイントークン (色 / 角丸 / textStyle) と
    // 各コンポーネントの recipe をまとめて提供する
    presets: [
        "@pandacss/preset-panda",
        createPreset({ brandColor: "mori", grayColor: stone, radius: "md" }),
    ],

    include: ["./src/**/*.{ts,tsx}"],
    exclude: [],

    // @morinoparty/chlorophyll-react は node_modules 配下の生 TSX を
    // そのまま配布しており、variant は実行時に渡される。Panda の静的抽出が
    // 効かないため、preset の各 recipe が自分で `staticCss: ["*"]` を持っている。
    // こちら側で使うレシピを並べ直す必要はない

    jsxFramework: "react",
    outdir: "styled-system",
});
