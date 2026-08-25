import { createServerFn } from "@tanstack/react-start";
import {
    fetchStations,
    patchStationName,
    patchStationSlug,
} from "../../-api/advance-railway";

/**
 * AdvanceRailway の駅一覧を取得する。
 * アクセストークンをクライアントに渡さないため、通信はサーバー側で行う。
 */
export const getStations = createServerFn().handler(async () => ({
    stations: await fetchStations(),
}));

/** 駅の slug を変更する */
export const updateStationSlug = createServerFn({ method: "POST" })
    .inputValidator((input: { id: string; slug: string }) => input)
    .handler(({ data }) => patchStationSlug(data.id, data.slug));

/** 駅の名前を変更する */
export const updateStationName = createServerFn({ method: "POST" })
    .inputValidator((input: { id: string; name: string }) => input)
    .handler(({ data }) => patchStationName(data.id, data.name));
