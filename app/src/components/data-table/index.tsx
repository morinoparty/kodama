import { ark, type HTMLArkProps } from "@ark-ui/react/factory";
import type { ReactNode } from "react";
import { css, cx } from "styled-system/css";

// --- スタイル定義 -------------------------------------------------------

const tableContainerStyle = css({
    width: "full",
    overflowX: "auto",
    borderRadius: "lg",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "border.subtle",
    bg: "bg.panel",
    boxShadow: "sm",
});

const tableStyle = css({
    width: "full",
    captionSide: "bottom",
    textStyle: "sm",
    borderCollapse: "collapse",
    textAlign: "start",
});

const headerStyle = css({
    bg: "bg.subtle",
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    borderColor: "border.subtle",
});

const bodyStyle = css({
    "& tr:last-child": {
        borderBottomWidth: "0",
    },
});

const footerStyle = css({
    borderTopWidth: "1px",
    borderTopStyle: "solid",
    borderColor: "border.subtle",
    bg: "bg.subtle",
    fontWeight: "medium",
});

const rowStyle = css({
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    borderColor: "border.subtle",
    transitionProperty: "background-color",
    transitionDuration: "fast",
    transitionTimingFunction: "easeInOut",
    _hover: {
        bg: "bg.muted",
    },
    "&[data-state='selected']": {
        bg: "colorPalette.bg.subtle",
    },
});

const headStyle = css({
    h: "10",
    px: "4",
    py: "2",
    textAlign: "start",
    verticalAlign: "middle",
    fontWeight: "semibold",
    textStyle: "xs",
    color: "fg.muted",
    letterSpacing: "wider",
    userSelect: "none",
    whiteSpace: "nowrap",
});

const cellStyle = css({
    px: "4",
    py: "3",
    verticalAlign: "middle",
    color: "fg",
    whiteSpace: "nowrap",
});

const captionStyle = css({
    mt: "4",
    textStyle: "xs",
    color: "fg.muted",
    textAlign: "center",
});

const emptyStyle = css({
    px: "4",
    py: "8",
    textAlign: "center",
    color: "fg.muted",
    textStyle: "sm",
});

// --- コンポーネント -----------------------------------------------------

export interface TableRootProps extends HTMLArkProps<"table"> {
    /** 横スクロールコンテナに追加するクラス名 */
    containerClassName?: string;
}

function TableRoot({
    className,
    containerClassName,
    children,
    ...props
}: TableRootProps) {
    return (
        <div className={cx(tableContainerStyle, containerClassName)}>
            <ark.table {...props} className={cx(tableStyle, className)}>
                {children}
            </ark.table>
        </div>
    );
}

export type TableHeaderProps = HTMLArkProps<"thead">;
function TableHeader({ className, ...props }: TableHeaderProps) {
    return <ark.thead {...props} className={cx(headerStyle, className)} />;
}

export type TableBodyProps = HTMLArkProps<"tbody">;
function TableBody({ className, ...props }: TableBodyProps) {
    return <ark.tbody {...props} className={cx(bodyStyle, className)} />;
}

export type TableFooterProps = HTMLArkProps<"tfoot">;
function TableFooter({ className, ...props }: TableFooterProps) {
    return <ark.tfoot {...props} className={cx(footerStyle, className)} />;
}

export type TableRowProps = HTMLArkProps<"tr">;
function TableRow({ className, ...props }: TableRowProps) {
    return <ark.tr {...props} className={cx(rowStyle, className)} />;
}

export type TableHeadProps = HTMLArkProps<"th">;
function TableHead({ className, ...props }: TableHeadProps) {
    return <ark.th {...props} className={cx(headStyle, className)} />;
}

export type TableCellProps = HTMLArkProps<"td">;
function TableCell({ className, ...props }: TableCellProps) {
    return <ark.td {...props} className={cx(cellStyle, className)} />;
}

export type TableCaptionProps = HTMLArkProps<"caption">;
function TableCaption({ className, ...props }: TableCaptionProps) {
    return <ark.caption {...props} className={cx(captionStyle, className)} />;
}

export interface TableEmptyProps {
    readonly colSpan: number;
    readonly children?: ReactNode;
}
function TableEmpty({
    colSpan,
    children = "データがありません",
}: TableEmptyProps) {
    return (
        <ark.tr className={rowStyle}>
            <ark.td colSpan={colSpan} className={emptyStyle}>
                {children}
            </ark.td>
        </ark.tr>
    );
}

export const Table = Object.assign(TableRoot, {
    Root: TableRoot,
    Header: TableHeader,
    Body: TableBody,
    Footer: TableFooter,
    Row: TableRow,
    Head: TableHead,
    Cell: TableCell,
    Caption: TableCaption,
    Empty: TableEmpty,
});
