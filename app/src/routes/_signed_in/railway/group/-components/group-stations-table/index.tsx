import { Badge, Button, Spinner, Table } from "@morinoparty/chlorophyll-react";
import { useRouter } from "@tanstack/react-router";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useState } from "react";
import { css } from "styled-system/css";
import { notifyFailed, notifySaved } from "@/components/app-toaster";
import { CodeChip } from "../../../-components/code-chip";
import type { GroupStation } from "../../../-types";
import { reorderGroupStations } from "../../-api/get-group-detail";
import { moveItem } from "../../-functions/move-item";

// 駅名は一覧の主役なので少し強く見せる
const nameStyle = css({ fontWeight: "medium", color: "fg" });

const mutedTextStyle = css({ textStyle: "xs", color: "fg.subtle" });

// 並べ替えのボタンは 2 つ並ぶだけなので、列を中身の幅まで縮めて右端に寄せる
const actionsStyle = css({
    display: "inline-flex",
    alignItems: "center",
    gap: "1",
});

const iconStyle = css({ width: "4", height: "4" });

// 保存中でも列幅が動かないよう、スピナーはボタンの隣に固定幅で添える
const savingStyle = css({
    display: "inline-flex",
    alignItems: "center",
    gap: "2",
    textStyle: "xs",
    color: "fg.muted",
});

export interface GroupStationsTableProps {
    /** 並びを書き換えるグループの UUID */
    readonly groupId: string;
    /** loader が取得した、並び順の駅 */
    readonly stations: GroupStation[];
}

/**
 * グループに属する駅を並び順に並べ、上下に動かせる表。
 *
 * 駅番号は駅自身ではなく並び順が決めるので、1 つ動かすと後ろの駅の番号もずれる。
 * そのため保存は「駅の並びをまるごと送る」形にし、押した直後は
 * 「その位置の駅番号」を付け替えて見せてから、保存後に読み直して確定させる。
 *
 * 見出しの並べ替えができると手で作った並びと衝突するので、
 * 一覧用の DataTable ではなく Table をそのまま使っている。
 */
export function GroupStationsTable({
    groupId,
    stations,
}: GroupStationsTableProps) {
    const router = useRouter();
    const [isSaving, setSaving] = useState(false);
    // 押した直後に動かして見せるための手元の並び。
    // loader が読み直されたら、そちらを正として引き直す
    const [order, setOrder] = useState<readonly GroupStation[]>(stations);
    const [source, setSource] = useState<readonly GroupStation[]>(stations);
    if (source !== stations) {
        setSource(stations);
        setOrder(stations);
    }

    const handleMove = async (from: number, to: number) => {
        const moved = moveItem(order, from, to);
        if (moved === order) {
            return;
        }

        const station = order[from].station;
        setOrder(moved);
        setSaving(true);
        try {
            await reorderGroupStations({
                data: {
                    id: groupId,
                    // 並びの指定は slug でも通るが、slug は書き換わりうるので UUID で送る
                    stationIds: moved.map((entry) => entry.station.id),
                },
            });
            notifySaved(`${station.name} を ${to + 1} 番目に移動しました`);
            // 駅番号は API 側が並びから組み立てるので、読み直して確定させる
            await router.invalidate();
        } catch (error) {
            notifyFailed(error);
            setOrder(order);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.Head>ナンバリング</Table.Head>
                    <Table.Head>駅名</Table.Head>
                    <Table.Head>slug</Table.Head>
                    <Table.Head>並び替え</Table.Head>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {order.length > 0 ? (
                    order.map((entry, index) => (
                        <Table.Row key={entry.station.id}>
                            <Table.Cell>
                                {/* 駅番号は「その位置に付く番号」なので、動かした駅ではなく
                                    元の並びの同じ位置から引く */}
                                <NumberingCell
                                    numbering={stations[index]?.numbering}
                                />
                            </Table.Cell>
                            <Table.Cell className={nameStyle}>
                                {entry.station.name}
                            </Table.Cell>
                            <Table.Cell>
                                <CodeChip>{entry.station.slug}</CodeChip>
                            </Table.Cell>
                            <Table.Cell>
                                <span className={actionsStyle}>
                                    <Button
                                        intent="plain"
                                        size="sm"
                                        aria-label={`${entry.station.name} を上へ移動`}
                                        disabled={isSaving || index === 0}
                                        onClick={() =>
                                            handleMove(index, index - 1)
                                        }
                                    >
                                        <ChevronUpIcon
                                            className={iconStyle}
                                            aria-hidden="true"
                                        />
                                    </Button>
                                    <Button
                                        intent="plain"
                                        size="sm"
                                        aria-label={`${entry.station.name} を下へ移動`}
                                        disabled={
                                            isSaving ||
                                            index === order.length - 1
                                        }
                                        onClick={() =>
                                            handleMove(index, index + 1)
                                        }
                                    >
                                        <ChevronDownIcon
                                            className={iconStyle}
                                            aria-hidden="true"
                                        />
                                    </Button>
                                </span>
                            </Table.Cell>
                        </Table.Row>
                    ))
                ) : (
                    <Table.Empty colSpan={4}>
                        このグループに属する駅がありません
                    </Table.Empty>
                )}
            </Table.Body>
            <Table.Caption>
                {isSaving ? (
                    <span className={savingStyle}>
                        <Spinner size="sm" aria-label="保存中" />
                        並びを保存しています
                    </span>
                ) : (
                    `${order.length} 件`
                )}
            </Table.Caption>
        </Table>
    );
}

/** 駅番号。ナンバリングを持たないグループでは「なし」を薄く出す */
function NumberingCell({ numbering }: { numbering?: string | null }) {
    if (!numbering) {
        return <span className={mutedTextStyle}>なし</span>;
    }
    return (
        <Badge variant="subtle" size="sm">
            {numbering}
        </Badge>
    );
}
