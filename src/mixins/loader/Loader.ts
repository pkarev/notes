import {Vue, Component, ProvideReactive, Provide} from 'vue-property-decorator';

@Component
export default class LoaderMixin extends Vue implements LoaderMixinInterface {
    @ProvideReactive()
    isLoading = false;

    @Provide()
    async load(callback: () => Promise<void>): Promise<void> {
        this.isLoading = true;

        try {
            await callback();
        } finally {
            this.isLoading = false;
        }
    }
}

export interface LoaderMixinInterface {
    isLoading: boolean;
    load: (callback: () => Promise<void>) => Promise<void>;
}
