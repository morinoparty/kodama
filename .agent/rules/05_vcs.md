# Version Control

- ブランチを切る際は main ブランチから切り、プルリクエストは必ず main ブランチに対して行うこと
- 作業を始める前に、main ブランチの最新の状態を取り込んでからブランチを切って作業すること
- 別の作業があったとしても、できるだけすべてのファイルをステージングの対象とすること
- main ブランチは GitHub の ruleset で保護されており、直接 push はできません。
  Check ワークフローが通り、PR を squash merge することでのみ main に反映されます。

## 作業の流れ

コードを変更する依頼を受けたら、次の流れを最後まで自動で進めてください。
途中の各ステップでいちいち確認を取る必要はありません。

1. main の最新を取り込み、そこから作業ブランチを切る

   ```bash
   git fetch origin main
   git switch -c <prefix>/<summary> origin/main
   ```

   ブランチ名は `feat/` `fix/` `refactor/` `docs/` `chore/` などの接頭辞 + kebab-case
   （例: `feat/panda-css-and-storybook`）。すでに作業用のブランチにいる場合は切り直さない。

2. 実装する

3. `pnpm run check` と `pnpm run typecheck` を通す。
   ビルド設定や依存に手を入れたときは `pnpm run build:all` も通す。

4. 変更をすべてステージングしてコミットする

   ```bash
   git add -A
   git commit -m "emoji コミットの概要"
   ```

5. push する

   ```bash
   git push -u origin <ブランチ名>
   ```

6. PR を作る（本文は日本語で、変更内容と動作確認結果を書く）

   ```bash
   gh pr create --base main --title "emoji タイトル" --body-file <本文のファイル>
   ```

7. 作成した PR の URL を報告する

ただし次の場合は、その場で止めてユーザーに相談してください。

- `pnpm run check` / `pnpm run typecheck` / ビルドが通らない
- 履歴を書き換える操作（`push --force` / `rebase` / `reset --hard`）が必要になった
- 秘密情報（トークン・鍵・パスワード）をコミットに含めることになりそうなとき
- main へ直接 push する必要が出たとき（ruleset で禁止されています）

## Repository

- [Kodama](https://github.com/morinoparty/kodama)

## コミットメッセージ

- コミットメッセージは英語で書き、以下のような形式で書く。

```
emoji コミットの概要
```

例:
```
🔐 Add MineAuth OIDC sign-in flow
```

- 何を変更したかだけを書く。参考にした他プロジェクト名などは書かない。

## Issueについて

- 新しい機能を追加する場合は、Issue を作成してください。
- Issue は英語で書き、適切なラベルを追加してください。
- 現状存在しないラベルについては、勝手に作成しないでください。
- どうしても必要である場合は、ユーザーに相談してください。

## PRについて

- PR の本文は日本語で書いて、変更内容と動作確認結果を記載してください。
- PR のタイトルもコミットメッセージと同じく emoji で始まる形式にしてください。

例:
```
🗒️ Kodama 用の .agent ルール設定を追加
```
