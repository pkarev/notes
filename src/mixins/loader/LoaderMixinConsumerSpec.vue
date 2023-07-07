<script lang="ts">
import {Vue, Component, InjectReactive, Inject} from 'vue-property-decorator';
import LoaderMixinProviderSpec from '@/mixins/loader/LoaderMixinProviderSpec.vue';

@Component({
    components: {LoaderMixinProviderSpec}
})
export default class LoaderMixinConsumerSpec extends Vue {
    @InjectReactive() isLoading!: boolean;
    @Inject() load: (callback: () => Promise<void>) => Promise<void>

    async loadAsync(): Promise<void> {
        await this.load(async () => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve()
                }, 0);
            })
        });
    }
}
</script>

<template>
    <div>
        <button type="button" @click="loadAsync">load consumer</button>
    </div>
</template>
