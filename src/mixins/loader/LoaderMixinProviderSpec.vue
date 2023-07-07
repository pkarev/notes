<script lang="ts">
import {Mixins, Component} from 'vue-property-decorator';
import LoaderMixin from '@/mixins/loader/Loader';

@Component
export default class LoaderMixinProviderSpec extends Mixins(LoaderMixin) {
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
        <button type="button" @click="loadAsync">load</button>
        <slot></slot>
    </div>
</template>
