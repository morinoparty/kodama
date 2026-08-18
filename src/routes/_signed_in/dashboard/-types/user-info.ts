// MineAuth のユーザー情報取得 API (`/oauth2/userinfo`) の戻り値型
export interface UserInfoData {
    sub: string; // Minecraft の UUID
    picture: string; // プロフィール画像 URL
    preferred_username: string; // 通常 MCID と同一
    email: string; // noreply メールアドレス
    email_verified: boolean; // email が認証されているか
    roles: string[]; // ロール一覧(運営権限の判定に使う)
}
