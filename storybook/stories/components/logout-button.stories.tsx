import type { Meta, StoryObj } from "@storybook/react-vite";
import { LogoutButton } from "@/components/logout-button";

const meta = {
    title: "Components/LogoutButton",
    component: LogoutButton,
    parameters: {
        docs: {
            description: {
                component: [
                    "セッションを破棄してトップページへ戻るボタン。",
                    "送信時に TanStack Start のサーバー関数を呼ぶが、",
                    "Storybook にはサーバーが無いため押しても最後まで動かない。",
                    "見た目の確認のみに使う。",
                ].join(""),
            },
        },
    },
} satisfies Meta<typeof LogoutButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
