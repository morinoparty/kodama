# コンポーネントについて

## 命名規則

- コンポーネントのディレクトリ名は kebab-case を使用してください。
  (例: `src/components/logout-button/index.tsx`)
- 1 ディレクトリにつき 1 コンポーネントとし、エントリーポイントは `index.tsx` にしてください。

## 設計パターン

- 関数コンポーネントと Hooks を使用してください（クラスコンポーネントは使用しない）。
- 複数のパーツから構成される UI は Compound Component パターンに従って設計してください。
  - 参考: [Compound Component パターン](https://www.patterns.dev/react/compound-pattern/)
- props のバケツリレーが 3 階層を超える場合は Context の導入を検討してください。

## 配置場所

- **全体で利用するコンポーネント**は `src/components/` 配下にフラットに配置してください。
  - 例: `src/components/header/index.tsx`
- **各ページごとに利用するコンポーネント**は、該当ページの近くに配置してください。
  - 配置場所: `src/routes/**/-components/`
  - 例: `src/routes/_signed_in/dashboard/-components/plugin-card/index.tsx`
- グローバルで利用するもの以外は、必ず `src/routes` にある各ページの付近に配置してください。
