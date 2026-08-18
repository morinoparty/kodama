import { signInAction } from "../-api/sign-in-action";

// サーバー関数で取得した認可 URL へブラウザごと遷移させる。
// SPA ナビゲーションでは外部 origin に飛べないため window.location を使う
export async function handleLogin() {
    const result = await signInAction();
    if (result.redirectUrl) {
        window.location.href = result.redirectUrl;
    }
}
