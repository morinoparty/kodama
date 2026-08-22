import type { Meta, StoryObj } from "@storybook/react-vite";
import { css } from "styled-system/css";
import { Breadcrumb } from "@/components/breadcrumb";

// 折り返しを確認するため、あえて幅を絞る枠
const narrowStyle = css({ maxWidth: "72" });

const meta = {
    title: "Components/Breadcrumb",
    component: Breadcrumb.Root,
    parameters: {
        docs: {
            description: {
                component: [
                    "パンくずリスト。Chlorophyll にも Ark UI にも該当するコンポーネントが無いため、",
                    "nav > ol > li のセマンティックな HTML に Panda のトークンでスタイルを当てて作っている。",
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

/** 幅が足りないときは折り返す。ヘッダーでは横スクロールで吸収する */
export const Wrapped: Story = {
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
