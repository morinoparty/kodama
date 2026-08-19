import "@/style/app.css";
import type { Decorator, Preview } from "@storybook/react-vite";
import { useEffect } from "react";
import { css } from "styled-system/css";
import { withDummyRouter } from "./dummy-router";

// アプリ本体は __root.tsx の body でブランドパレットを指定している。
// Portal 経由で document.body 直下に描画される Drawer などにも
// colorPalette.* のトークンを行き渡らせるため、Storybook でも body に当てる
const bodyPaletteStyle = css({ colorPalette: "mori" });

// アプリ本体と同じ方法 (html の light / dark クラスと data-theme 属性) で
// カラーモードを切り替える。Panda のトークンがこれに追従する
const withColorMode: Decorator = (Story, context) => {
    const colorMode = context.globals.colorMode ?? "light";

    useEffect(() => {
        const root = document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(colorMode);
        root.setAttribute("data-theme", colorMode);
        root.style.colorScheme = colorMode;
    }, [colorMode]);

    useEffect(() => {
        const classNames = bodyPaletteStyle.split(" ");
        document.body.classList.add(...classNames);
        return () => {
            document.body.classList.remove(...classNames);
        };
    }, []);

    return <Story />;
};

const preview: Preview = {
    globalTypes: {
        colorMode: {
            description: "カラーモード",
            defaultValue: "light",
            toolbar: {
                title: "Color Mode",
                icon: "circlehollow",
                items: [
                    { value: "light", icon: "sun", title: "Light" },
                    { value: "dark", icon: "moon", title: "Dark" },
                ],
            },
        },
    },
    parameters: {
        a11y: {
            test: "error",
        },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        layout: "centered",
    },
    decorators: [
        withColorMode,
        (Story) => (
            <div
                className={css({
                    colorPalette: "mori",
                    bg: "bg",
                    color: "fg",
                    p: "4",
                })}
            >
                <Story />
            </div>
        ),
        withDummyRouter("/"),
    ],
    tags: ["autodocs"],
};

export default preview;
