import type { RailwayItem } from "../../-types";

/**
 * 一覧表示用に、ID で参照されている駅とグループを名前へ解決した路線。
 *
 * 一覧に出したいのは名前だけなので、解決はサーバー側でまとめて済ませる。
 * 対応する駅・グループが見つからなかったときは ID をそのまま残し、
 * 「空欄になって気づけない」状態にはしない。
 */
export interface RailwayRow extends RailwayItem {
    /** 出発駅の名前 */
    readonly fromStationName: string;
    /** 到着駅の名前 */
    readonly toStationName: string;
    /** グループの名前。未所属なら null */
    readonly groupName: string | null;
}

/** 路線一覧ページの loader が返すもの */
export interface RailwayListData {
    readonly railways: RailwayRow[];
}
