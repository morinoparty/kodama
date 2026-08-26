// グループを「国鉄」と「私鉄」のどちらの事業者として見せるかの振り分け。
//
// AdvanceRailway 側にこの区分を持つ項目は無いので、ここで名前を並べて決めている。
// そのため、グループ一覧でグループ名を書き換えるとその路線は私鉄に移る。
// 国鉄を増やしたり名前を変えたときは、下の一覧も合わせて直すこと。

/** 国鉄側の見出し */
export const NATIONAL_OPERATOR = "国鉄";

/** 私鉄側の見出し。国鉄に載っていないグループはすべてこちらに入る */
export const PRIVATE_OPERATOR = "私鉄";

/** Select の見出しを並べる順番 */
export const OPERATOR_ORDER: readonly string[] = [
    NATIONAL_OPERATOR,
    PRIVATE_OPERATOR,
];

// 国鉄として扱うグループ名。表示名そのままで突き合わせる
const NATIONAL_GROUP_NAMES: ReadonlySet<string> = new Set([
    "あつもり環状線",
    "もりもと中央線",
    "もりもと郊外線",
    "もりもと西部線",
    "うみもと線",
    "ぱかぱか高速鉄道ぱかぱか高速ライン(緑草線)",
    "ぷくぷく低速鉄道ぷくぷく低速ライン(緑藻線)",
    "迷大鉄道",
    "聖花線",
]);

/** グループ名から、国鉄・私鉄のどちらとして見せるかを決める */
export const operatorOfGroup = (groupName: string): string =>
    NATIONAL_GROUP_NAMES.has(groupName) ? NATIONAL_OPERATOR : PRIVATE_OPERATOR;

/**
 * 事業者ごとにまとめた並びにする。国鉄が先、私鉄が後で、
 * それぞれの中では渡された並びをそのまま保つ。
 *
 * Select は隣り合った同じ見出しをひとまとまりとして描くので、
 * 並べ替えておけばそのまま見出し付きの一覧になる。
 */
export const sortByOperator = <T>(
    items: readonly T[],
    nameOf: (item: T) => string,
): T[] =>
    OPERATOR_ORDER.flatMap((operator) =>
        items.filter((item) => operatorOfGroup(nameOf(item)) === operator),
    );
