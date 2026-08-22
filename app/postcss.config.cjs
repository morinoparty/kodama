// Vite がこのファイルを自動で読む。
// vite.config.ts の css.postcss に書くと postcss の型が二重解決されるため、
// PostCSS の設定はこちらに一本化している
module.exports = {
    plugins: {
        "@pandacss/dev/postcss": {},
        autoprefixer: {},
    },
};
