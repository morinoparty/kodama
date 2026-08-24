# スタイリング

## 基本方針

- スタイルは Panda CSS で書きます。`styled-system` からインポートして使ってください。

```tsx
import { css } from "styled-system/css";
import { Flex, Stack } from "styled-system/jsx";
import { flex } from "styled-system/patterns";

<div className={css({ bg: "bg.panel", color: "fg", p: "4", rounded: "md" })}>
```

- レイアウトは `styled-system/jsx` の `Flex` / `Stack` / `HStack` / `Box` や、
  `styled-system/patterns` の `flex()` / `stack()` / `grid()` を使うと簡潔に書けます。
- `styled-system/` は `panda codegen` の生成物です。手で編集しないでください。
- グローバル CSS のエントリは `app/src/style/app.css` です。
  Panda のレイヤー宣言だけを置き、個別のスタイルはここに足さないでください。

## デザイントークン

生の色値 (`#0f172a` や `rgba(...)`) は書かず、Chlorophyll preset のセマンティックトークンを使ってください。

- 背景: `bg` / `bg.subtle` / `bg.muted` / `bg.panel` / `bg.emphasized` / `bg.inverted` / `bg.disabled`
- 文字: `fg` / `fg.muted` / `fg.subtle` / `fg.disabled`
- 罫線: `border` / `border.subtle` / `border.muted` / `border.emphasized` / `border.interactive`
- 配色: `colorPalette` を指定すると `colorPalette.solid` / `.contrast` / `.fg` / `.bg` / `.border` /
  `.hover` / `.1`〜`.12` / `.a1`〜`.a12` が使えます。ブランド色は `mori` です。

```tsx
<div className={css({ colorPalette: "mori", bg: "colorPalette.solid", color: "colorPalette.contrast" })}>
```

- 余白・角丸・フォントサイズなども `p: "4"` / `rounded: "md"` / `fontSize: "sm"` のように
  トークン名で指定し、`px` 直書きは避けてください。

## レスポンシブ

- モバイルファーストで書き、条件付き値でブレークポイントを足します。

```tsx
css({ flexDirection: { base: "column", md: "row" }, p: { base: "3", lg: "6" } })
```

- 横スクロールが発生しないようにしてください。表やコードブロックは個別に
  `overflowX: "auto"` のコンテナに入れてください。

## カラーモード

このプロジェクトは **light のみ**で作ります。ダークモードには対応しません。

- `_dark` 条件や `.dark` / `[data-theme="dark"]` セレクタは書かないでください。
- Chlorophyll preset のセマンティックトークンは light 側の値だけを持っており、
  ビルドされる CSS にダークモード用の宣言は 1 つも出ません。`_dark` を書いても無視されます。
- したがって「light では読めるが dark では読めない」といった配慮は不要です。
  トークンをそのまま使ってください。

## 文言

- 画面に表示する文言は日本語で書いてください。
