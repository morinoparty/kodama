import type { Meta, StoryObj } from "@storybook/react-vite";
import { RegisterForm } from "@/routes/_signed_in/players/-components/register-form";

// Storybook にはサーバーが無いので、送信は少し待ってから成功したことにする
const wait = () => new Promise<void>((resolve) => setTimeout(resolve, 800));

const meta = {
    title: "Players/RegisterForm",
    component: RegisterForm,
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: [
                    "mc-api へプレイヤーを登録する入力欄 (1 人 / 一括)。",
                    "UUID の形式と件数 (最大 100 件) を Zod で検証してから送る。",
                    "Storybook では送信しても mc-api には届かない。",
                ].join(""),
            },
        },
    },
    args: {
        onRegisterOne: wait,
        onRegisterBatch: wait,
    },
} satisfies Meta<typeof RegisterForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
