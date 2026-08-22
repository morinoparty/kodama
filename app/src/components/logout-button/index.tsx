import { Button } from "@morinoparty/chlorophyll-react";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { LogOutIcon } from "lucide-react";
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
            <Button type="submit" intent="secondary" size="sm">
                <LogOutIcon aria-hidden="true" />
                ログアウト
            </Button>
        </form>
    );
}
