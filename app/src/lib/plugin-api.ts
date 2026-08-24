import { env } from "cloudflare:workers";
import { getRequest } from "@tanstack/react-start/server";
import { getAuth } from "./auth";

/**
 * MineAuth のプラグイン API を叩くための Bearer トークンを取得する。
 *
 * 必ず access token を使う。MineAuth は受け取った JWT の `token_type` クレームが
 * `"token"` であることを確認しており、これを持つのは access token だけなので、
 * id_token を送ると `Token is not valid or has expired` で 401 になる。
 * さらに MineAuth は refresh_token グラントで id_token を再発行しない
 * (OIDC の一般的な作法) ため、ログイン時の id_token は更新されず失効する。
 *
 * access token が失効していても getAccessToken が refresh token で自動更新し、
 * ローテーション後の refresh token も account クッキーへ書き戻される。
 */
async function getPluginApiToken(): Promise<string> {
    const auth = await getAuth();
    const { accessToken } = await auth.api.getAccessToken({
        body: { useAccountCookie: true },
        headers: getRequest().headers,
    });

    if (!accessToken) {
        throw new Error(
            "アクセストークンが見つかりません。再ログインしてください。",
        );
    }

    return accessToken;
}

/**
 * メインサーバーのプラグイン API から JSON を取得する。
 *
 * トークンの取得・付与とレスポンスの検査をここに閉じ込め、
 * 各ルートのサーバー関数はパスと戻り値の型だけを与えれば済むようにしている。
 *
 * @param path `MAIN_SERVER_URL` からの相対パス (例: `/api/v1/plugins/...`)
 * @param resourceLabel 失敗時のメッセージに使う日本語のリソース名 (例: `駅一覧`)
 *
 * 戻り値の型は呼び出し側が指定する。レスポンスの検証はしていないため、
 * `as` によるキャストはこの 1 か所に閉じ込めている。
 */
export async function fetchPluginApi<T>(
    path: string,
    resourceLabel: string,
): Promise<T> {
    const token = await getPluginApiToken();

    const response = await fetch(`${env.MAIN_SERVER_URL}${path}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    // 失敗レスポンスのボディをそのまま値として扱うと描画時に落ちて原因が
    // 分かりにくくなる。ここで loader の失敗にして errorComponent に処理を渡す
    if (!response.ok) {
        const detail = await response.text().catch(() => "");
        throw new Error(
            `${resourceLabel}の取得に失敗しました (${response.status}${detail ? `: ${detail}` : ""})`,
        );
    }

    return (await response.json()) as T;
}
