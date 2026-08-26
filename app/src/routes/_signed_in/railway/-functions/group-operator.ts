// グループを「国鉄」と「私鉄」のどちらの事業者として見せるかの振り分けと、並び順。
//
// AdvanceRailway 側にこの区分を持つ項目は無いので、ここで名前を並べて決めている。
// そのため、グループ一覧でグループ名を書き換えるとその路線は私鉄に移る。
// 国鉄を増やしたり名前を変えたときは、下の一覧も合わせて直すこと。

/** 国鉄側の見出し */
export const NATIONAL_OPERATOR = "国鉄";

/** 私鉄側の見出し。国鉄に載っていないグループはすべてこちらに入る */
export const PRIVATE_OPERATOR = "私鉄";

// 国鉄として扱うグループ名。表示名そのままで突き合わせる。
// この並びがそのまま国鉄の中の表示順になる
// (森本 → うみもと → あつもり → 聖花 → ぱかぱか → ぷくぷく)
//
// 迷大鉄道は私鉄なので載せない。国鉄なのは同社の聖花線だけ
const NATIONAL_GROUP_NAMES: readonly string[] = [
    "もりもと中央線",
    "もりもと郊外線",
    "もりもと西部線",
    "うみもと線",
    "あつもり環状線",
    "聖花線",
    "ぱかぱか高速鉄道ぱかぱか高速ライン(緑草線)",
    "ぷくぷく低速鉄道ぷくぷく低速ライン(緑藻線)",
];

// 名前から表示順を引く表。国鉄かどうかの判定もこれで兼ねる
const NATIONAL_ORDER: ReadonlyMap<string, number> = new Map(
    NATIONAL_GROUP_NAMES.map((name, index) => [name, index]),
);

/** グループ名から、国鉄・私鉄のどちらとして見せるかを決める */
export const operatorOfGroup = (groupName: string): string =>
    NATIONAL_ORDER.has(groupName) ? NATIONAL_OPERATOR : PRIVATE_OPERATOR;

/**
 * 見出し付きで並べたときの順番を比べる。
 * 国鉄が先で、その中は上の一覧の順。私鉄は後で、その中は名前順。
 */
const compareGroupNames = (a: string, b: string): number => {
    const rankA = NATIONAL_ORDER.get(a);
    const rankB = NATIONAL_ORDER.get(b);

    if (rankA !== undefined && rankB !== undefined) {
        return rankA - rankB;
    }
    // 片方だけ国鉄なら、そちらを先に出す
    if (rankA !== undefined) return -1;
    if (rankB !== undefined) return 1;

    return a.localeCompare(b, "ja");
};

/**
 * 事業者ごとにまとまるよう並べ替える。
 *
 * Select は隣り合った同じ見出しをひとまとまりとして描くので、
 * 並べ替えておけばそのまま見出し付きの一覧になる。
 */
export const sortByOperator = <T>(
    items: readonly T[],
    nameOf: (item: T) => string,
): T[] => [...items].sort((a, b) => compareGroupNames(nameOf(a), nameOf(b)));
