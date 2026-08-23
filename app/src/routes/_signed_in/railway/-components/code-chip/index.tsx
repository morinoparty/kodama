import type { ReactNode } from "react";
import { css } from "styled-system/css";

const codeChipStyle = css({
    fontFamily: "mono",
    textStyle: "xs",
    color: "fg.muted",
    bg: "bg.muted",
    px: "1.5",
    py: "0.5",
    borderRadius: "sm",
});

/**
 * ID や座標のような、そのまま読み取って使う値を表示する小さなコード片。
 */
export function CodeChip({ children }: { children: ReactNode }) {
    return <code className={codeChipStyle}>{children}</code>;
}
