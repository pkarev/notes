import {mount, Wrapper} from '@vue/test-utils';
import ShakeMixinSpec from '@/mixins/shake/ShakeMixinSpec.vue';
import {getWrapperBySelectorText} from '../../../tests/utils';
import {Vue} from 'vue-property-decorator';

let wrapper: Wrapper<Vue>

jest.useFakeTimers();

describe(`ShakeMixin`, () => {
    it(`Toggles na-shaking class on shake trigger`, async () => {
        wrapper = mount(ShakeMixinSpec);

        const shakeButton = getWrapperBySelectorText(wrapper, `button`, `Shake`);

        expect(shakeButton.classes().includes(`na-shaking`)).toBe(false);

        await shakeButton.trigger(`click`);

        expect(shakeButton.classes().includes(`na-shaking`)).toBe(true);

        jest.runAllTimers();
        await Vue.nextTick();

        expect(shakeButton.classes().includes(`na-shaking`)).toBe(false);
    })
});
