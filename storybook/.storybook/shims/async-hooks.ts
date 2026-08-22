export class AsyncLocalStorage<T = unknown> {
    getStore(): T | undefined {
        return undefined;
    }
    // biome-ignore lint/suspicious/noExplicitAny: Stub implementation for Storybook compatibility
    run(_store: T, fn: (...args: any[]) => any, ...args: any[]) {
        return fn(...args);
    }
    enterWith(_store: T) {}
}
