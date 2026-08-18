import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { getAuth } from "../../lib/auth";

// サーバー側でセッションクッキーを破棄する
const signOutAction = createServerFn().handler(async () => {
    const auth = await getAuth();
    await auth.api.signOut({
        headers: getRequest().headers,
    });
});

export function LogoutButton() {
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await signOutAction();
        // クッキー破棄後の状態を確実に反映させるためフルリロードする
        window.location.href = "/";
    };

    return (
        <form onSubmit={handleSubmit}>
            <button
                type="submit"
                className="rounded-full border border-[rgba(23,58,64,0.2)] bg-white/50 px-4 py-2 text-sm font-semibold text-[var(--sea-ink)] transition hover:-translate-y-0.5 hover:border-[rgba(23,58,64,0.35)]"
            >
                ログアウト
            </button>
        </form>
    );
}
