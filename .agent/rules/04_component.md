# コンポーネントについて

## 何で作るか

1. まず `@morinoparty/chlorophyll-react` (Chlorophyll) に使えるコンポーネントがないか探します。
   Button / Menu / Drawer / List / Tooltip / Badge / Spinner / Skeleton / ModalDialog / Portal などがあります。

```tsx
import { Button } from "@morinoparty/chlorophyll-react";

<Button intent="primary" size="md">保存する</Button>
```

2. Chlorophyll に無いものは、Ark UI (`@ark-ui/react`) の headless コンポーネントに
   Panda CSS でスタイルを当てて作ります。

```tsx
import { Collapsible } from "@ark-ui/react/collapsible";
```

3. アイコンは `lucide-react` を使います。
4. shadcn/ui は使いません。

## 命名規則

- コンポーネントのディレクトリ名は kebab-case を使用してください。
  (例: `app/src/components/logout-button/index.tsx`)
- 1 ディレクトリにつき 1 コンポーネントとし、エントリーポイントは `index.tsx` にしてください。

## 設計パターン

- 関数コンポーネントと Hooks を使用してください（クラスコンポーネントは使用しない）。
- 複数のパーツから構成される UI は Compound Component パターンに従って設計してください。
  - 参考: [Compound Component パターン](https://www.patterns.dev/react/compound-pattern/)
- props のバケツリレーが 3 階層を超える場合は Context の導入を検討してください。

## 配置場所

- **全体で利用するコンポーネント**は `app/src/components/` 配下にフラットに配置してください。
  - 例: `app/src/components/app-sidebar/index.tsx`
- **各ページごとに利用するコンポーネント**は、該当ページの近くに配置してください。
  - 配置場所: `app/src/routes/**/-components/`
  - 例: `app/src/routes/_signed_in/-components/plugin-card/index.tsx`
- グローバルで利用するもの以外は、必ず `app/src/routes` にある各ページの付近に配置してください。

## Storybook

- story は `storybook/stories/` 配下に `*.stories.tsx` として置きます。
  (例: `storybook/stories/components/theme-toggle.stories.tsx`)
- app のコンポーネントは `@/` エイリアス (= `app/src/`) で参照してください。

```tsx
import ThemeToggle from "@/components/theme-toggle";
```

- 表示に必要な共通の設定 (カラーモード切り替え、ダミールーター) は
  `storybook/.storybook/preview.tsx` に入っています。story 側で用意し直さないでください。
