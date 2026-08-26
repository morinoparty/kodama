/**
 * 配列の要素を 1 つだけ別の位置へ動かした、新しい配列を返す。
 *
 * 動かす先が配列の外なら、何もせず元の配列をそのまま返す
 * (先頭で「上へ」・末尾で「下へ」を押しても壊れないようにするため)。
 */
export const moveItem = <T>(
    items: readonly T[],
    from: number,
    to: number,
): readonly T[] => {
    if (to < 0 || to >= items.length || from === to) {
        return items;
    }

    const moved = [...items];
    const [target] = moved.splice(from, 1);
    moved.splice(to, 0, target);
    return moved;
};
