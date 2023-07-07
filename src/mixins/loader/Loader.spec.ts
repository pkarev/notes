import {mount, Wrapper} from '@vue/test-utils';
import {Vue} from 'vue-property-decorator';
import {getWrapperBySelectorText} from '../../../tests/utils';
import LoaderMixinProviderSpec from '@/mixins/loader/LoaderMixinProviderSpec.vue';
import LoaderMixinConsumerSpec from '@/mixins/loader/LoaderMixinConsumerSpec.vue';
import LoaderMixinProviderAndConsumerCombSpec from '@/mixins/loader/LoaderMixinProviderAndConsumerCombSpec.vue';

let wrapper: Wrapper<Vue>;

jest.useFakeTimers();

describe(`LoaderMixinProvider`, () => {
    it(`Should toggle isLoading on load call`, async () => {
        wrapper = mount(LoaderMixinProviderSpec);
        const getLoadButton = getWrapperBySelectorText(wrapper, `button`, `load`);

        expect(wrapper.vm.$data.isLoading).toBe(false);

        await getLoadButton.trigger(`click`);

        expect(wrapper.vm.$data.isLoading).toBe(true);

        jest.runAllTimers();
        await Vue.nextTick();

        expect(wrapper.vm.$data.isLoading).toBe(false);
    });
});

describe(`LoaderMixinConsumer`, () => {
    it(`Should toggle isLoading on load call`, async () => {
        wrapper = mount(LoaderMixinProviderAndConsumerCombSpec);

        const provider = wrapper.findComponent(LoaderMixinProviderSpec);
        const consumer = wrapper.findComponent(LoaderMixinConsumerSpec);

        expect(provider.vm.$data.isLoading).toBe(false);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(consumer.vm.isLoading).toBe(false);

        const getLoadButton = getWrapperBySelectorText(wrapper, `button`, `load consumer`);
        await getLoadButton.trigger(`click`);

        await Vue.nextTick();

        expect(provider.vm.$data.isLoading).toBe(true);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(consumer.vm.isLoading).toBe(true);

        await Vue.nextTick();
        jest.runAllTimers();
        await Vue.nextTick();

        expect(provider.vm.$data.isLoading).toBe(false);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(consumer.vm.isLoading).toBe(false);
    });
});
