import type { Point3D } from "../-types";

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
