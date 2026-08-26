import { Badge } from "@morinoparty/chlorophyll-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { createColumnHelper } from "@tanstack/react-table";
import { DataTable, type DataTableProps } from "@/components/data-table";

// DataTable はジェネリックなので、Storybook の型推論では TData が unknown になる。
// ここで扱うデータの型を明示して meta / Story を組み立てる
type SampleTableProps = DataTableProps<SampleData>;

const meta: Meta<SampleTableProps> = {
    title: "Components/Table",
    component: DataTable,
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: [
                    "Chlorophyll の Table に TanStack Table の状態管理を載せたデータテーブル。",
                    "`DataTable` に列定義とデータを渡すと、並べ替えと絞り込み込みで描画する。",
                    "凝った表を組みたいときは Chlorophyll の `Table.*` プリミティブを直接使う。",
                ].join(""),
            },
        },
    },
};

export default meta;

type Story = StoryObj<SampleTableProps>;

interface SampleData {
    id: string;
    name: string;
    status: "active" | "inactive";
    role: string;
}

const SAMPLE_DATA: SampleData[] = [
    { id: "1", name: "Alice", status: "active", role: "Admin" },
    { id: "2", name: "Bob", status: "inactive", role: "User" },
    { id: "3", name: "Charlie", status: "active", role: "Moderator" },
];

const columnHelper = createColumnHelper<SampleData>();

const columns = [
    columnHelper.accessor("id", {
        header: "ID",
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("name", {
        header: "名前",
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("status", {
        header: "状態",
        cell: (info) => (
            <Badge
                variant="subtle"
                status={info.getValue() === "active" ? "success" : "warning"}
            >
                {info.getValue()}
            </Badge>
        ),
    }),
    columnHelper.accessor("role", {
        header: "ロール",
        enableSorting: false,
        cell: (info) => info.getValue(),
    }),
];

// 見出しを押すと並べ替わる。「ロール」列だけ enableSorting: false で無効にしてある
export const Default: Story = {
    args: {
        data: SAMPLE_DATA,
        columns,
        caption: "見出しを押すと並べ替えできる",
    },
};

// 見出しの上に Select が並び、選ぶとその値の行だけが残る。
// 選択肢は渡したデータから自動で作られる
export const Filtered: Story = {
    args: {
        data: SAMPLE_DATA,
        columns,
        filters: [
            { columnId: "status", label: "状態" },
            { columnId: "role", label: "ロール" },
        ],
    },
};

export const Empty: Story = {
    args: {
        data: [],
        columns,
        emptyMessage: "データが存在しません",
    },
};
