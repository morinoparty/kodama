/**
 * Storybook build shim for TanStack Start internal router entry.
 *
 * TanStack Start projects normally provide this via their Vite plugin/runtime.
 * Storybook build does not need SSR/router entry generation, so we stub it.
 */
export const router = undefined;
export default {};
