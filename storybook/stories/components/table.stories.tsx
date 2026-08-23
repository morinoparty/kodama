import { Badge } from "@morinoparty/chlorophyll-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { Table } from "@/components/data-table";

const meta = {
    title: "Components/Table",
    component: Table,
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component:
                    "Panda CSS と Ark UI でスタイリングしたデータテーブルコンポーネント。TanStack Table と組み合わせて利用できます。",
            },
        },
    },
} satisfies Meta<typeof Table>;

export default meta;

type Story = StoryObj<typeof meta>;

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
        cell: (info) => info.getValue(),
    }),
];

function TanStackTableExample() {
    const table = useReactTable({
        data: SAMPLE_DATA,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <Table>
            <Table.Header>
                {table.getHeaderGroups().map((headerGroup) => (
                    <Table.Row key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <Table.Head key={header.id}>
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                          header.column.columnDef.header,
                                          header.getContext(),
                                      )}
                            </Table.Head>
                        ))}
                    </Table.Row>
                ))}
            </Table.Header>
            <Table.Body>
                {table.getRowModel().rows.map((row) => (
                    <Table.Row key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                            <Table.Cell key={cell.id}>
                                {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext(),
                                )}
                            </Table.Cell>
                        ))}
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
}

export const Default: Story = {
    render: () => <TanStackTableExample />,
};

export const Empty: Story = {
    render: () => (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.Head>ID</Table.Head>
                    <Table.Head>名前</Table.Head>
                    <Table.Head>状態</Table.Head>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                <Table.Empty colSpan={3}>データが存在しません</Table.Empty>
            </Table.Body>
        </Table>
    ),
};
