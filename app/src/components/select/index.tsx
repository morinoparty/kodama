import {
    Select as ArkSelect,
    createListCollection,
} from "@ark-ui/react/select";
import { Portal } from "@morinoparty/chlorophyll-react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { useMemo } from "react";
import { css, cx } from "styled-system/css";

// Chlorophyll に Select が無いため、Ark UI に Panda でスタイルを当てて作っている。
// 追加の提案は morinoparty/Chlorophyll#81

export interface SelectOption {
    readonly label: string;
    readonly value: string;
}

const triggerStyle = css({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "2",
    px: "2",
    py: "1",
    borderRadius: "md",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "border.subtle",
    bg: "bg.panel",
    minWidth: "44",
    textStyle: "sm",
    color: "fg",
    cursor: "pointer",
    _hover: { bg: "colorPalette.surface" },
    // outline: "none" だと outline-style が none のまま残り、
    // フォーカスリングが描かれない
    _focusVisible: {
        outlineStyle: "solid",
        outlineWidth: "2px",
        outlineColor: "colorPalette.focus.ring",
        outlineOffset: "2px",
    },
    "& :where(svg)": { width: "3.5", height: "3.5", flexShrink: "0" },
});

const contentStyle = css({
    display: "flex",
    flexDirection: "column",
    gap: "0.5",
    minWidth: "40",
    maxHeight: "72",
    overflowY: "auto",
    p: "1",
    borderRadius: "md",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "border.subtle",
    bg: "bg.panel",
    boxShadow: "md",
    zIndex: "dropdown",
});

const itemStyle = css({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "2",
    px: "2",
    py: "1.5",
    borderRadius: "sm",
    textStyle: "sm",
    color: "fg",
    cursor: "pointer",
    "&[data-highlighted]": { bg: "colorPalette.surface" },
    "&[data-state='checked']": {
        bg: "colorPalette.surface.active",
        color: "colorPalette.fg",
    },
    "& :where(svg)": { width: "3.5", height: "3.5", flexShrink: "0" },
});

export interface SelectProps {
    /** 選択中の値 */
    readonly value: string;
    readonly options: readonly SelectOption[];
    readonly onValueChange: (value: string) => void;
    /** 読み上げ用の名前 */
    readonly label: string;
    readonly placeholder?: string;
    readonly className?: string;
}

/**
 * 1 つだけ選ぶセレクト。
 *
 * メニューは Portal 経由で描く。表のように `overflow-x: auto` の中に置いても
 * 切れないようにするため。
 */
export function Select({
    value,
    options,
    onValueChange,
    label,
    placeholder,
    className,
}: SelectProps) {
    const collection = useMemo(
        () => createListCollection({ items: [...options] }),
        [options],
    );

    return (
        <ArkSelect.Root
            collection={collection}
            value={[value]}
            onValueChange={(details) => onValueChange(details.value[0])}
            positioning={{ sameWidth: false }}
        >
            <ArkSelect.Label className={css({ srOnly: true })}>
                {label}
            </ArkSelect.Label>
            <ArkSelect.Control>
                <ArkSelect.Trigger className={cx(triggerStyle, className)}>
                    <ArkSelect.ValueText placeholder={placeholder} />
                    <ChevronsUpDownIcon aria-hidden="true" />
                </ArkSelect.Trigger>
            </ArkSelect.Control>
            <Portal>
                <ArkSelect.Positioner>
                    <ArkSelect.Content className={contentStyle}>
                        {options.map((option) => (
                            <ArkSelect.Item
                                key={option.value}
                                item={option}
                                className={itemStyle}
                            >
                                <ArkSelect.ItemText>
                                    {option.label}
                                </ArkSelect.ItemText>
                                <ArkSelect.ItemIndicator>
                                    <CheckIcon aria-hidden="true" />
                                </ArkSelect.ItemIndicator>
                            </ArkSelect.Item>
                        ))}
                    </ArkSelect.Content>
                </ArkSelect.Positioner>
            </Portal>
        </ArkSelect.Root>
    );
}
