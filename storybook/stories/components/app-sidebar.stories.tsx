import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { css } from "styled-system/css";
import { AppSidebar } from "@/components/app-sidebar";

// _signed_in.tsx と同じ 2 カラム構成を再現する。
// サイドバーは高さいっぱいに広がるので、外枠にも高さを持たせる
const layoutStyle = css({
    colorPalette: "mori",
    display: "flex",
    flexDirection: { base: "column", lg: "row" },
    minHeight: "100dvh",
    bg: "bg",
    color: "fg",
});

const mainStyle = css({
    flex: "1",
    minWidth: "0",
    p: "6",
    color: "fg.muted",
    textStyle: "sm",
});

const withSignedInLayout: Decorator = (Story) => (
    <div className={layoutStyle}>
        <Story />
        <main className={mainStyle}>
            ここにページの内容が入る。サイドバーの見え方を確認するためのダミー領域。
        </main>
    </div>
);

const meta = {
    title: "Components/AppSidebar",
    component: AppSidebar,
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component: [
                    "運営ツールのサイドバー。lg 以上では画面左に常時表示し、",
                    "lg 未満では上部バーのハンバーガーボタンから Drawer として開く。",
                    "内部のログアウトボタンは TanStack Start のサーバー関数を呼ぶため",
                    "Storybook では実行できない。描画とレイアウトの確認のみに使う。",
                ].join(""),
            },
        },
        // 表示の切り替えは Panda の lg ブレークポイント (メディアクエリ) に
        // よるため、ラッパーの幅ではなくビューポート幅を変えて再現する
        viewport: {
            options: {
                desktop: {
                    name: "デスクトップ",
                    styles: { width: "1280px", height: "800px" },
                    type: "desktop",
                },
                mobile: {
                    name: "モバイル",
                    styles: { width: "390px", height: "844px" },
                    type: "mobile",
                },
            },
        },
    },
    decorators: [withSignedInLayout],
} satisfies Meta<typeof AppSidebar>;

export default meta;

type Story = StoryObj<typeof meta>;

/** lg 以上。サイドバーが左に常時表示される */
export const Default: Story = {
    globals: {
        viewport: { value: "desktop", isRotated: false },
    },
};

/** lg 未満。上部バーのハンバーガーボタンから Drawer を開ける */
export const Mobile: Story = {
    globals: {
        viewport: { value: "mobile", isRotated: false },
    },
    parameters: {
        docs: {
            description: {
                story: "ハンバーガーボタンを押すと Drawer が開く。Drawer の開閉はクライアント側だけで完結するため Storybook でも動作する。",
            },
        },
    },
};
