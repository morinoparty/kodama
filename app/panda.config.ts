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
    // そのまま配布しており、variant は実行時に渡される。
    // Panda の静的抽出が効かないため、使うレシピの CSS を先に出しておく。
    // 足し忘れるとそのコンポーネントの CSS が 1 行も出ず、
    // 素の HTML のような見た目になるので、使い始めたら必ずここに追加する
    staticCss: {
        recipes: {
            button: ["*"],
            drawer: ["*"],
        },
    },

    jsxFramework: "react",
    outdir: "styled-system",
});
