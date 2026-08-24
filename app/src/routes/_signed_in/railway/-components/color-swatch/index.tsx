import { css } from "styled-system/css";
import { CodeChip } from "../code-chip";

const wrapperStyle = css({
    display: "inline-flex",
    alignItems: "center",
    gap: "2",
});

const dotStyle = css({
    width: "4",
    height: "4",
    borderRadius: "full",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "border.subtle",
    flexShrink: "0",
});

/**
 * グループや駅に設定された配色を、見本の丸と色コードで示す。
 *
 * 色はサーバーから渡ってくる任意の値なので、デザイントークンでは
 * 表現できない。ここだけ style 属性で直接指定する。
 */
export function ColorSwatch({ color }: { color: string }) {
    return (
        <span className={wrapperStyle}>
            <span
                className={dotStyle}
                style={{ backgroundColor: color }}
                aria-hidden="true"
            />
            <CodeChip>{color}</CodeChip>
        </span>
    );
}
