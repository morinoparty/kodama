import {
    Select as ChlorophyllSelect,
    createListCollection,
    Portal,
} from "@morinoparty/chlorophyll-react";
import { useMemo } from "react";
import { css, cx } from "styled-system/css";

// Chlorophyll の Select は Compound Component で細かく組み立てられるが、
// このアプリで必要なのは「ラベル + 選択肢の配列から 1 つ選ぶ」だけなので、
// 表のセルや絞り込みバーから使いやすい形に薄くまとめている

export interface SelectOption {
    readonly label: string;
    readonly value: string;
}

// Chlorophyll の Select は幅を親に委ねる (root が width: full)。
// 表のセルや絞り込みバーには内容分の幅で置きたいので、ここで幅を決める
const rootStyle = css({ width: "auto", minWidth: "44" });

export interface SelectProps {
    /** 選択中の値 */
    readonly value: string;
    readonly options: readonly SelectOption[];
    readonly onValueChange: (value: string) => void;
    /** 読み上げ用の名前 */
    readonly label: string;
    readonly placeholder?: string;
    /** true の間は選び直せなくする (保存中など) */
    readonly disabled?: boolean;
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
    disabled = false,
    className,
}: SelectProps) {
    const collection = useMemo(
        () => createListCollection({ items: [...options] }),
        [options],
    );

    return (
        <ChlorophyllSelect.Root
            collection={collection}
            disabled={disabled}
            value={[value]}
            onValueChange={(details) => onValueChange(details.value[0])}
            // 既定では一覧が Trigger と同じ幅に揃うが、Trigger は内容より狭いことがある。
            // 選択肢を省略せずに読ませたいので中身の幅に任せる
            positioning={{ sameWidth: false }}
            className={cx(rootStyle, className)}
        >
            <ChlorophyllSelect.Label className={css({ srOnly: true })}>
                {label}
            </ChlorophyllSelect.Label>
            <ChlorophyllSelect.Control>
                <ChlorophyllSelect.Trigger>
                    <ChlorophyllSelect.ValueText placeholder={placeholder} />
                    <ChlorophyllSelect.Indicator />
                </ChlorophyllSelect.Trigger>
            </ChlorophyllSelect.Control>
            <Portal>
                <ChlorophyllSelect.Positioner>
                    <ChlorophyllSelect.Content>
                        {options.map((option) => (
                            <ChlorophyllSelect.Item
                                key={option.value}
                                item={option}
                            >
                                <ChlorophyllSelect.ItemText>
                                    {option.label}
                                </ChlorophyllSelect.ItemText>
                                <ChlorophyllSelect.ItemIndicator />
                            </ChlorophyllSelect.Item>
                        ))}
                    </ChlorophyllSelect.Content>
                </ChlorophyllSelect.Positioner>
            </Portal>
        </ChlorophyllSelect.Root>
    );
}
