import type { Meta, StoryObj } from "@storybook/react-vite";
import { css } from "styled-system/css";
import { Breadcrumb } from "@/components/breadcrumb";

// 入り切らないときの挙動を確認するため、あえて幅を絞ったスクロール枠。
// ヘッダー (AppHeader) でも同じように横スクロールで吸収している
const narrowStyle = css({
    maxWidth: "72",
    overflowX: "auto",
    scrollbarWidth: "none",
    "&::-webkit-scrollbar": { display: "none" },
});

const meta = {
    title: "Components/Breadcrumb",
    component: Breadcrumb.Root,
    parameters: {
        docs: {
            description: {
                component: [
                    "パンくずリスト。Chlorophyll の Breadcrumb に TanStack Router の Link を差し込み、",
                    "1 行に収める見た目とリンクを持たない段 (Text) だけをこのアプリ側で足している。",
                    "実際の画面では AppBreadcrumb がルートの staticData から段を組み立てる。",
                ].join(""),
            },
        },
    },
} satisfies Meta<typeof Breadcrumb.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

/** 現在地だけの 1 段。トップページのような階層の浅い画面 */
export const Single: Story = {
    render: () => (
        <Breadcrumb.Root>
            <Breadcrumb.List>
                <Breadcrumb.Item>
                    <Breadcrumb.Page>ホーム</Breadcrumb.Page>
                </Breadcrumb.Item>
            </Breadcrumb.List>
        </Breadcrumb.Root>
    ),
};

/** 祖先がリンクになり、末尾だけが現在地 (aria-current="page") として描かれる */
export const Nested: Story = {
    render: () => (
        <Breadcrumb.Root>
            <Breadcrumb.List>
                <Breadcrumb.Item>
                    <Breadcrumb.Link to="/plugins">プラグイン</Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Separator />
                <Breadcrumb.Item>
                    <Breadcrumb.Page>Chlorophyll</Breadcrumb.Page>
                </Breadcrumb.Item>
            </Breadcrumb.List>
        </Breadcrumb.Root>
    ),
};

/** 画面を持たない階層は Text で描く。リンクにも現在地にもならない */
export const WithoutLink: Story = {
    render: () => (
        <Breadcrumb.Root>
            <Breadcrumb.List>
                <Breadcrumb.Item>
                    <Breadcrumb.Text>鉄道</Breadcrumb.Text>
                </Breadcrumb.Item>
                <Breadcrumb.Separator />
                <Breadcrumb.Item>
                    <Breadcrumb.Link to="/rail/lines">路線</Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Separator />
                <Breadcrumb.Item>
                    <Breadcrumb.Page>もりのパーティ本線</Breadcrumb.Page>
                </Breadcrumb.Item>
            </Breadcrumb.List>
        </Breadcrumb.Root>
    ),
};

/** 幅が足りないときは折り返さず、1 行のまま横スクロールする */
export const Overflow: Story = {
    render: () => (
        <div className={narrowStyle}>
            <Breadcrumb.Root>
                <Breadcrumb.List>
                    <Breadcrumb.Item>
                        <Breadcrumb.Link to="/plugins">
                            プラグイン
                        </Breadcrumb.Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Separator />
                    <Breadcrumb.Item>
                        <Breadcrumb.Link to="/rail">鉄道</Breadcrumb.Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Separator />
                    <Breadcrumb.Item>
                        <Breadcrumb.Link to="/rail/lines">路線</Breadcrumb.Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Separator />
                    <Breadcrumb.Item>
                        <Breadcrumb.Page>もりのパーティ本線</Breadcrumb.Page>
                    </Breadcrumb.Item>
                </Breadcrumb.List>
            </Breadcrumb.Root>
        </div>
    ),
};
