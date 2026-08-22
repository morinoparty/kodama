import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { css } from "styled-system/css";
import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/sidebar-provider";

// _signed_in.tsx と同じ構成を再現する。
// ヘッダーの開閉ボタンはサイドバーの状態を切り替えるため、
// story でもサイドバーごと並べないと動きが確認できない
const layoutStyle = css({
    colorPalette: "mori",
    display: "flex",
    minHeight: "100dvh",
    bg: "bg",
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
            <AppSidebar />
            <div className={contentStyle}>
                <Story />
                <main className={mainStyle}>
                    ここにページの内容が入る。ヘッダーの見え方を確認するためのダミー領域。
                </main>
            </div>
        </div>
    </SidebarProvider>
);

const meta = {
    title: "Components/AppHeader",
    component: AppHeader,
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component: [
                    "ログイン後の画面の上部ヘッダー。サイドバーの開閉ボタンとパンくずリストを並べる。",
                    "開閉ボタンは lg 未満では Drawer を開き、lg 以上ではサイドバーを折りたたむ。",
                    "パンくずは現在のルートの staticData から自動で組み立てられる。",
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
} satisfies Meta<typeof AppHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

/** lg 以上。ボタンを押すと左のサイドバーが折りたたまれる */
export const Default: Story = {
    globals: {
        viewport: { value: "desktop", isRotated: false },
    },
};

/** lg 未満。ボタンを押すとサイドバーが Drawer として開く */
export const Mobile: Story = {
    globals: {
        viewport: { value: "mobile", isRotated: false },
    },
};
