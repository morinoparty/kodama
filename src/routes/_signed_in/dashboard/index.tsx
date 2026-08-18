import { createFileRoute } from "@tanstack/react-router";
import { LogoutButton } from "../../../components/logout-button";
import { getUserInfo } from "./-functions/get-user-info";

export const Route = createFileRoute("/_signed_in/dashboard/")({
    loader: () => getUserInfo(),
    component: DashboardPage,
});

function DashboardPage() {
    const userInfo = Route.useLoaderData();

    return (
        <main className="page-wrap px-4 pb-8 pt-14">
            <section className="island-shell rounded-[2rem] px-6 py-10 sm:px-10">
                <p className="island-kicker mb-3">ダッシュボード</p>
                <div className="flex flex-wrap items-center gap-4">
                    <img
                        src={userInfo.picture}
                        alt={userInfo.preferred_username}
                        width={64}
                        height={64}
                        className="h-16 w-16 rounded-2xl"
                    />
                    <div>
                        <h1 className="display-title text-2xl font-bold tracking-tight text-[var(--sea-ink)]">
                            {userInfo.preferred_username}
                        </h1>
                        <p className="m-0 text-sm text-[var(--sea-ink-soft)]">
                            {userInfo.roles.join(", ") || "ロールなし"}
                        </p>
                    </div>
                    <div className="ml-auto">
                        <LogoutButton />
                    </div>
                </div>
            </section>
        </main>
    );
}
