import type { Point3D } from "../-types";

/**
 * 所要時間（秒）を人間が読みやすい形式に整形する
 * @param seconds 秒数
 * @returns 整形された文字列（例: "1分30秒", "45秒"）
 */
export function formatDuration(seconds: number): string {
    if (seconds < 0) {
        return "0秒";
    }
    const mins = Math.floor(seconds / 60);
    const remainingSecs = Math.floor(seconds % 60);

    if (mins === 0) {
        return `${remainingSecs}秒`;
    }
    if (remainingSecs === 0) {
        return `${mins}分`;
    }
    return `${mins}分${remainingSecs}秒`;
}

/**
 * 3次元座標を文字列に整形する
 * @param point 座標
 * @returns 整形された文字列（例: "(120, 64, -300)"）
 */
export function formatPoint(point: Point3D): string {
    const x = Math.round(point.x);
    const y = Math.round(point.y);
    const z = Math.round(point.z);
    return `(${x}, ${y}, ${z})`;
}
