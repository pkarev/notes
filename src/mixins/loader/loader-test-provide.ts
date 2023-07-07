export const loaderTestProvide = {
    __reactiveInject__: {
        isLoading: false,
    },
    async load(callback: () => Promise<void>): Promise<void> {
        await callback();
    }
}
