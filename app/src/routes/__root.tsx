import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { css } from "styled-system/css";

import appCss from "../style/app.css?url";

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`;

// Chlorophyll のレシピは colorPalette を参照するため、
// body でブランド色を指定して配下 (Portal の描画先も含む) に行き渡らせる
const bodyStyle = css({
    colorPalette: "mori",
    minHeight: "100dvh",
    bg: "bg",
    color: "fg",
    overflowWrap: "anywhere",
});

export const Route = createRootRoute({
    head: () => ({
        meta: [
            {
                charSet: "utf-8",
            },
            {
                name: "viewport",
                content: "width=device-width, initial-scale=1",
            },
            {
                title: "Kodama - もりのパーティ サーバー管理",
            },
        ],
        links: [
            {
                rel: "stylesheet",
                href: appCss,
            },
        ],
    }),
    shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ja" suppressHydrationWarning>
            <head>
                {/* テーマのちらつきを防ぐため、ハイドレーション前に自前のスクリプトを同期実行する */}
                <script
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: 固定の定数のみを埋め込むため XSS のリスクはない
                    dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
                />
                <HeadContent />
            </head>
            <body className={bodyStyle}>
                {children}
                <TanStackDevtools
                    config={{
                        position: "bottom-right",
                    }}
                    plugins={[
                        {
                            name: "Tanstack Router",
                            render: <TanStackRouterDevtoolsPanel />,
                        },
                    ]}
                />
                <Scripts />
            </body>
        </html>
    );
}
