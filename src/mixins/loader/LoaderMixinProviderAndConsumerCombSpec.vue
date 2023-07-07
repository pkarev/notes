<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';
import LoaderMixinConsumerSpec from '@/mixins/loader/LoaderMixinConsumerSpec.vue';
import LoaderMixinProviderSpec from '@/mixins/loader/LoaderMixinProviderSpec.vue';

@Component({
    components: {
        LoaderMixinProviderSpec,
        LoaderMixinConsumerSpec
    }
})
export default class LoaderMixinProviderAndConsumerCombSpec extends Vue {
}
</script>

<template>
    <LoaderMixinProviderSpec>
        <LoaderMixinConsumerSpec/>
    </LoaderMixinProviderSpec>
</template>
