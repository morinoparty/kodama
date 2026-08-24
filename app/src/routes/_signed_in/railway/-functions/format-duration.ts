/**
 * 所要時間 (秒) を人間が読みやすい形式に整形する。
 *
 * @example formatDuration(90) // "1分30秒"
 * @example formatDuration(45) // "45秒"
 */
export function formatDuration(seconds: number): string {
    if (seconds <= 0) {
        return "0秒";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    if (minutes === 0) {
        return `${remainingSeconds}秒`;
    }
    if (remainingSeconds === 0) {
        return `${minutes}分`;
    }
    return `${minutes}分${remainingSeconds}秒`;
}
