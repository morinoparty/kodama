import { createServerFn } from "@tanstack/react-start";
import {
    fetchGroupStations,
    fetchGroups,
    fetchStation,
    fetchStations,
    patchStationName,
    patchStationSlug,
    putGroupStations,
} from "../../-api/advance-railway";

/**
 * AdvanceRailway の駅一覧と、所属を選び直すためのグループ一覧を取得する。
 * アクセストークンをクライアントに渡さないため、通信はサーバー側で行う。
 */
export const getStations = createServerFn().handler(async () => {
    const [stations, groups] = await Promise.all([
        fetchStations(),
        fetchGroups(),
    ]);
    return { stations, groups };
});

/** 駅の slug を変更する */
export const updateStationSlug = createServerFn({ method: "POST" })
    .inputValidator((input: { id: string; slug: string }) => input)
    .handler(({ data }) => patchStationSlug(data.id, data.slug));

/** 駅の名前を変更する */
export const updateStationName = createServerFn({ method: "POST" })
    .inputValidator((input: { id: string; name: string }) => input)
    .handler(({ data }) => patchStationName(data.id, data.name));

/**
 * 駅が所属するグループを、渡した一覧のとおりに付け替える。
 *
 * AdvanceRailway には駅側から所属を変える口が無く
 * (`PATCH /stations/{id}` が受けるのは slug / 名前 / ワールド / 座標 / 表示サイズ / 色だけ)、
 * グループ側の並びをまるごと置き換える `PUT /groups/{id}/stations` しか無い。
 * そのため、いまの所属と見比べて、増えたグループ・減ったグループだけを
 * 読み直して書き戻している。
 *
 * 注意点が 3 つある。
 * - 足した駅はそのグループの末尾に付く。つまり番号はいちばん大きくなるので、
 *   途中に入れたいときはグループの詳細ページで動かす
 * - グループごとに 1 回ずつ書くので、途中で失敗すると一部だけ反映された状態になる。
 *   呼び出し側は失敗しても読み直すこと
 * - 書いている間に別の管理者が同じグループの並びを変えていると、その変更は消える
 *   (まるごと置換の API なので避けられない)
 */
export const updateStationGroups = createServerFn({ method: "POST" })
    .inputValidator((input: { stationId: string; groupIds: string[] }) => input)
    .handler(async ({ data }) => {
        // いまの所属はクライアントの表示ではなく API から引き直す。
        // 画面が古いまま送られてきても、実際の状態を基準に差分を取れる
        const station = await fetchStation(data.stationId);
        const current = new Set(
            station.numberings.map((numbering) => numbering.group),
        );
        const next = new Set(data.groupIds);

        const added = [...next].filter((groupId) => !current.has(groupId));
        const removed = [...current].filter((groupId) => !next.has(groupId));

        /** グループの並びを読み、駅の居場所を入れ替えて書き戻す */
        const rewrite = async (
            groupId: string,
            toStationIds: (stationIds: string[]) => string[],
        ) => {
            const entries = await fetchGroupStations(groupId);
            await putGroupStations(
                groupId,
                toStationIds(entries.map((entry) => entry.station.id)),
            );
        };

        // まとめて投げれば速いが、どこまで進んだかが分かりにくくなる。
        // 触るグループは高々数件なので、1 つずつ順に書く
        for (const groupId of added) {
            await rewrite(groupId, (stationIds) => [
                ...stationIds,
                data.stationId,
            ]);
        }
        for (const groupId of removed) {
            await rewrite(groupId, (stationIds) =>
                stationIds.filter((id) => id !== data.stationId),
            );
        }
    });
