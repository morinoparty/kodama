import { addons } from "storybook/manager-api";
import { create } from "storybook/theming";

// サイドバー左上の表示。どのプロジェクトの Storybook かひと目で分かるようにする
addons.setConfig({
    theme: create({
        base: "light",
        brandTitle: "Kodama",
        brandUrl: "https://kodama.moripa.nikomaru.dev",
        brandTarget: "_blank",
    }),
});
