import { useMatches } from "@tanstack/react-router";
import { Fragment } from "react";
import { breadcrumbsFromLoaderData } from "../../lib/breadcrumbs";
import { Breadcrumb } from "../breadcrumb";

/**
 * 現在のルートからパンくずを自動で組み立てて描く。
 *
 * 階層は一致した route の並びがそのまま表すので、各 route は自分の段だけを
 * `staticData.breadcrumbs` で名乗ればよい。loader が `breadcrumbs` を返した
 * 場合はそちらを優先する (プラグイン名や駅名など、読み込むまで決まらない段)。
 */
export function AppBreadcrumb() {
    const breadcrumbs = useMatches({
        select: (matches) =>
            matches.flatMap(
                (match) =>
                    breadcrumbsFromLoaderData(match.loaderData) ??
                    match.staticData.breadcrumbs ??
                    [],
            ),
    });

    // どの route も段を名乗っていないときは、区切り線だけが残らないよう何も描かない
    if (breadcrumbs.length === 0) {
        return null;
    }

    return (
        <Breadcrumb.Root>
            <Breadcrumb.List>
                {breadcrumbs.map((breadcrumb, index) => {
                    const isCurrent = index === breadcrumbs.length - 1;

                    return (
                        <Fragment
                            key={`${breadcrumb.label}-${breadcrumb.to ?? "current"}`}
                        >
                            {index > 0 ? <Breadcrumb.Separator /> : null}
                            <Breadcrumb.Item>
                                {isCurrent || !breadcrumb.to ? (
                                    <Breadcrumb.Page>
                                        {breadcrumb.label}
                                    </Breadcrumb.Page>
                                ) : (
                                    <Breadcrumb.Link to={breadcrumb.to}>
                                        {breadcrumb.label}
                                    </Breadcrumb.Link>
                                )}
                            </Breadcrumb.Item>
                        </Fragment>
                    );
                })}
            </Breadcrumb.List>
        </Breadcrumb.Root>
    );
}
