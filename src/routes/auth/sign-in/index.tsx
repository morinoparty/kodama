import { createFileRoute } from "@tanstack/react-router";
import { handleLogin } from "./-functions/handle-login";

export const Route = createFileRoute("/auth/sign-in/")({
    component: SignInPage,
});

function SignInPage() {
    return (
        <main className="page-wrap flex min-h-[70vh] items-center justify-center px-4 py-14">
            <section className="island-shell w-full max-w-md rounded-[2rem] px-8 py-10">
                <p className="island-kicker mb-3">もりのパーティ 運営ツール</p>
                <h1 className="display-title mb-4 text-3xl font-bold tracking-tight text-[var(--sea-ink)]">
                    Kodama にログイン
                </h1>
                <p className="mb-8 text-sm text-[var(--sea-ink-soft)]">
                    サーバー管理機能を利用するには、MineAuth
                    アカウントでのログインが必要なのだ。
                </p>
                <button
                    type="button"
                    onClick={handleLogin}
                    className="w-full rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-5 py-3 text-sm font-semibold text-[var(--lagoon-deep)] transition hover:-translate-y-0.5 hover:bg-[rgba(79,184,178,0.24)]"
                >
                    MineAuth でログイン
                </button>
            </section>
        </main>
    );
}
