import type { Meta, StoryObj } from "@storybook/react-vite";
import { RegisterResultsTable } from "@/routes/_signed_in/players/-components/register-results-table";

const meta = {
    title: "Players/RegisterResultsTable",
    component: RegisterResultsTable,
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: [
                    "mc-api へのプレイヤー登録の結果を 1 件ずつ並べる表。",
                    "状態は色付きの Badge で示し、状態ごとに絞り込める。",
                    "一括登録の応答には名前が含まれないため、名前は空 (—) になることがある。",
                ].join(""),
            },
        },
    },
} satisfies Meta<typeof RegisterResultsTable>;

export default meta;

type Story = StoryObj<typeof meta>;

/** 取りうる状態をひととおり並べたもの */
export const AllStatuses: Story = {
    args: {
        rows: [
            {
                index: 1,
                uuid: "f8b761ec-4a54-48eb-a040-c5604042bcc9",
                status: "registered",
                name: "_NIKOMARU",
            },
            {
                index: 2,
                uuid: "069a79f4-44e9-4726-a5be-fca90e38aaf5",
                status: "updated",
                name: "Notch",
            },
            {
                index: 3,
                uuid: "853c80ef-3c37-49fd-aa49-938b674adae6",
                status: "already_registered",
                name: null,
            },
            {
                index: 4,
                uuid: "61699b2e-d327-4a01-9f1e-0ea8c3f06bc6",
                status: "pending",
                name: null,
            },
            {
                index: 5,
                uuid: "00000000-0000-0000-0000-000000000000",
                status: "not_found",
                name: null,
            },
            {
                index: 6,
                uuid: "11111111-1111-1111-1111-111111111111",
                status: "error",
                name: null,
                message: "mc-api への登録に失敗しました (401: unauthorized)",
            },
        ],
    },
};

/** まだ何も登録していないとき */
export const Empty: Story = {
    args: { rows: [] },
};
