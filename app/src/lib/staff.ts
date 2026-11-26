/**
 * 運営メンバーであることを表す MineAuth のロール (LuckPerms のグループ名)。
 * 完全一致で判定する
 */
export const STAFF_ROLE = "staff";

/** ロール一覧に運営ロールが含まれているか */
export const hasStaffRole = (roles: readonly unknown[] | undefined): boolean =>
    Array.isArray(roles) && roles.includes(STAFF_ROLE);
