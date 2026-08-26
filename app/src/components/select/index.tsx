import {
    Select as ChlorophyllSelect,
    createListCollection,
    Portal,
} from "@morinoparty/chlorophyll-react";
import { Fragment, useMemo } from "react";
import { css, cx } from "styled-system/css";

// Chlorophyll の Select は Compound Component で細かく組み立てられるが、
// このアプリで必要なのは「ラベル + 選択肢の配列から 1 つ選ぶ」だけなので、
// 表のセルや絞り込みバーから使いやすい形に薄くまとめている

export interface SelectOption {
    readonly label: string;
    readonly value: string;
    /**
     * 見出しでまとめるときのグループ名。
     * 隣り合った同じ名前がひとまとまりになるので、呼び出し側は
     * まとめたい順に並べて渡す。省略した選択肢は見出しなしで並ぶ
     */
    readonly group?: string;
}

/** 見出しでまとめた 1 かたまり。`label` が null なら見出しを付けない */
interface OptionSection {
    /** 描き直しの目印。先頭の選択肢の値を使う (値は一覧の中で重複しない) */
    readonly id: string;
    readonly label: string | null;
    readonly options: readonly SelectOption[];
}

/**
 * 隣り合う同じ `group` の選択肢をひとまとまりにする。
 *
 * 並び替えはせず、渡された順をそのまま保つ。こうしておくと
 * 「先頭の『すべて』は見出しなし・末尾の『なし』も見出しなし」のように、
 * 呼び出し側が並びだけで見え方を決められる。
 */
const toSections = (options: readonly SelectOption[]): OptionSection[] => {
    const sections: {
        id: string;
        label: string | null;
        options: SelectOption[];
    }[] = [];

    for (const option of options) {
        const label = option.group ?? null;
        const current = sections.at(-1);
        if (current?.label === label) {
            current.options.push(option);
        } else {
            sections.push({ id: option.value, label, options: [option] });
        }
    }

    return sections;
};

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
    const sections = useMemo(() => toSections(options), [options]);

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
                        {sections.map((section) =>
                            section.label === null ? (
                                // 見出しの無いかたまりは、そのまま並べる
                                <Fragment key={section.id}>
                                    {section.options.map(renderItem)}
                                </Fragment>
                            ) : (
                                <ChlorophyllSelect.ItemGroup key={section.id}>
                                    <ChlorophyllSelect.ItemGroupLabel>
                                        {section.label}
                                    </ChlorophyllSelect.ItemGroupLabel>
                                    {section.options.map(renderItem)}
                                </ChlorophyllSelect.ItemGroup>
                            ),
                        )}
                    </ChlorophyllSelect.Content>
                </ChlorophyllSelect.Positioner>
            </Portal>
        </ChlorophyllSelect.Root>
    );
}

/** 選択肢 1 件。見出しの有無にかかわらず同じ描き方をする */
const renderItem = (option: SelectOption) => (
    <ChlorophyllSelect.Item key={option.value} item={option}>
        <ChlorophyllSelect.ItemText>{option.label}</ChlorophyllSelect.ItemText>
        <ChlorophyllSelect.ItemIndicator />
    </ChlorophyllSelect.Item>
);
