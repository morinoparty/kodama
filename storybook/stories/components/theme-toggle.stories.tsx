import type { Meta, StoryObj } from "@storybook/react-vite";
import ThemeToggle from "@/components/theme-toggle";

const meta = {
    title: "Components/ThemeToggle",
    component: ThemeToggle,
    parameters: {
        docs: {
            description: {
                component: [
                    "テーマを ライト → ダーク → 自動 の順に切り替えるボタン。",
                    "html 要素のクラスと localStorage を直接書き換えるため、",
                    "Storybook のツールバーにあるカラーモード切り替えとは独立して動く。",
                    "両方を操作すると表示が食い違うことがある。",
                ].join(""),
            },
        },
    },
} satisfies Meta<typeof ThemeToggle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
