import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { css } from "styled-system/css";
import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/sidebar-provider";

// _signed_in.tsx と同じ構成を再現する。
// サイドバーは高さいっぱいに広がるので、外枠にも高さを持たせる。
// 開閉ボタンはヘッダー側にあるため、ヘッダーも一緒に並べる
const layoutStyle = css({
    colorPalette: "mori",
    display: "flex",
    minHeight: "100dvh",
    bg: "colorPalette.bg",
    color: "fg",
});

const contentStyle = css({
    display: "flex",
    flexDirection: "column",
    flex: "1",
    minWidth: "0",
});

const mainStyle = css({
    flex: "1",
    minWidth: "0",
    p: "6",
    color: "fg.muted",
    textStyle: "sm",
});

const withSignedInLayout: Decorator = (Story) => (
    <SidebarProvider>
        <div className={layoutStyle}>
            <Story />
            <div className={contentStyle}>
                <AppHeader />
                <main className={mainStyle}>
                    ここにページの内容が入る。サイドバーの見え方を確認するためのダミー領域。
                </main>
            </div>
        </div>
    </SidebarProvider>
);

const meta = {
    title: "Components/AppSidebar",
    component: AppSidebar,
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component: [
                    "運営ツールのサイドバー。lg 以上では画面左に表示し、",
                    "ヘッダーのボタンで折りたたむ。lg 未満ではヘッダーのボタンから Drawer として開く。",
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

/** lg 以上。サイドバーが左に表示され、ヘッダーのボタンで折りたためる */
export const Default: Story = {
    globals: {
        viewport: { value: "desktop", isRotated: false },
    },
};

/** lg 未満。ヘッダーのハンバーガーボタンから Drawer を開ける */
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
