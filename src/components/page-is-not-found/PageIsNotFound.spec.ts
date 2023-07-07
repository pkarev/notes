import {createLocalVue, shallowMount, Wrapper} from '@vue/test-utils'
import PageIsNotFound from '@/components/page-is-not-found/PageIsNotFound.vue';
import {getWrapperBySelectorText} from '../../../tests/utils';
import getVueRouter from '@/router/router';
import {NotesAppRouteName} from '@/router/route-name';
import VueRouter from 'vue-router';

let wrapper: Wrapper<PageIsNotFound>;

const localVue = createLocalVue();
const goToMainButton = () => getWrapperBySelectorText(wrapper, `button`, `Go to main`);
const initRoute = () => wrapper.vm.$router.push({
    name: NotesAppRouteName.NOT_FOUND,
})

localVue.use(VueRouter);

describe(`PageIsNotFound.vue`, () => {
    it(`Renders text`, () => {
        wrapper = shallowMount(PageIsNotFound);

        expect(wrapper.text()).toMatch(`Page is not found`);
        expect(goToMainButton().exists()).toBe(true);
    });

    it(`Redirects to main`, async () => {
        wrapper = shallowMount(PageIsNotFound, {
            router: getVueRouter(),
            localVue,
        });
        initRoute();

        expect(wrapper.vm.$route.name).toBe(NotesAppRouteName.NOT_FOUND);

        await goToMainButton().trigger(`click`);

        expect(wrapper.vm.$route.name).toBe(NotesAppRouteName.MAIN);
    });
})
