import {
    createContext,
    type ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { token } from "styled-system/tokens";

// サイドバーが常時表示に切り替わる幅。Panda のトークンから引いて、
// CSS 側のブレークポイントと値がずれないようにする
const DESKTOP_MEDIA_QUERY = `(min-width: ${token("breakpoints.lg")})`;

interface SidebarContextValue {
    /** lg 以上で常時表示のサイドバーを開いているか */
    readonly isDesktopOpen: boolean;
    readonly toggleDesktop: () => void;
    /** lg 未満で Drawer を開いているか */
    readonly isMobileOpen: boolean;
    readonly setMobileOpen: (open: boolean) => void;
    readonly openMobile: () => void;
    readonly closeMobile: () => void;
}

const SidebarContext = createContext<SidebarContextValue | undefined>(
    undefined,
);

/**
 * サイドバーの開閉状態。ヘッダーの開閉ボタンとサイドバー本体は別の
 * コンポーネントなので、props のバケツリレーではなく Context で共有する。
 *
 * デスクトップ (lg 以上) の折りたたみと、モバイル (lg 未満) の Drawer は
 * 見た目も操作も別物なので、状態も分けて持つ。
 */
export function SidebarProvider({ children }: { children: ReactNode }) {
    const [isDesktopOpen, setIsDesktopOpen] = useState(true);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // 画面が lg 以上へ広がったとき、開いたままの Drawer が常時表示の
    // サイドバーと二重に出てしまうので閉じる
    useEffect(() => {
        const query = window.matchMedia(DESKTOP_MEDIA_QUERY);
        const closeOnDesktop = () => {
            if (query.matches) {
                setIsMobileOpen(false);
            }
        };

        closeOnDesktop();
        query.addEventListener("change", closeOnDesktop);
        return () => query.removeEventListener("change", closeOnDesktop);
    }, []);

    const toggleDesktop = useCallback(
        () => setIsDesktopOpen((open) => !open),
        [],
    );
    const openMobile = useCallback(() => setIsMobileOpen(true), []);
    const closeMobile = useCallback(() => setIsMobileOpen(false), []);

    const value = useMemo<SidebarContextValue>(
        () => ({
            isDesktopOpen,
            toggleDesktop,
            isMobileOpen,
            setMobileOpen: setIsMobileOpen,
            openMobile,
            closeMobile,
        }),
        [isDesktopOpen, toggleDesktop, isMobileOpen, openMobile, closeMobile],
    );

    return (
        <SidebarContext.Provider value={value}>
            {children}
        </SidebarContext.Provider>
    );
}

/** SidebarProvider の外で呼ぶと状態を共有できないため、その場で気付けるよう投げる */
export function useSidebar(): SidebarContextValue {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar は SidebarProvider の中で使ってください");
    }
    return context;
}
