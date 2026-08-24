import type { Point3D } from "../-types";

/**
 * 3 次元座標を表示用の文字列に整形する。
 * ブロック単位で読めれば十分なので小数は丸める。
 *
 * @example formatPoint({ x: 120.4, y: 64, z: -300.8 }) // "(120, 64, -301)"
 */
export function formatPoint(point: Point3D): string {
    const x = Math.round(point.x);
    const y = Math.round(point.y);
    const z = Math.round(point.z);
    return `(${x}, ${y}, ${z})`;
}
