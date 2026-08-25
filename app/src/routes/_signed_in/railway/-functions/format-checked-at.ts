// API は `Instant.toString()` の ISO 8601 (UTC) を返すので、
// 表示は日本時間に直す。
//
// タイムゾーンを明示しないと、SSR (Workers = UTC) とブラウザ (JST) で
// 結果が食い違ってハイドレーションがずれる
const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    // hour12: false は環境によって 0 時を 24 と出すため h23 を明示する
    hourCycle: "h23",
});

/**
 * 点検日時を `2026-01-01 11:11` の形に整える。
 * 未点検・解釈できない値のときは null を返し、呼び出し側で「未点検」を出す。
 */
export function formatCheckedAt(
    value: string | null | undefined,
): string | null {
    if (!value) {
        return null;
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return null;
    }

    const parts = formatter.formatToParts(date);
    const at = (type: Intl.DateTimeFormatPartTypes) =>
        parts.find((part) => part.type === type)?.value ?? "";

    return `${at("year")}-${at("month")}-${at("day")} ${at("hour")}:${at("minute")}`;
}
