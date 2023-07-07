import {Vue} from 'vue-property-decorator';
import VueRouter from 'vue-router';
import {createLocalVue, Wrapper} from '@vue/test-utils';
import App from '@/App.vue';
import {createWrapperFactory} from '../tests/create-wrapper-factory';
import {appContainer} from '@/inversify/inversify.config';
import getVueRouter from '@/router/router';
import {LoginForm} from '@/components/login-form';
import MbLocalStorage from '@/inversify/injectables/local-storage/local-storage';

import TYPES from '@/inversify/types';
import {LocalStorageKey} from '@/inversify/injectables/local-storage/model';
import {Api} from '@/inversify/interfaces';
import NotesList from '@/components/notes-list/NotesList.vue';
import NotesApi from '@/inversify/injectables/notes-api';
import FakeNotesApi from '@/inversify/injectables/fake-notes-api';
import flushPromises from 'flush-promises';

let wrapper: Wrapper<App>;

beforeEach(() => {
    appContainer.snapshot();
    appContainer.rebind<Api>(TYPES.Api).to(FakeNotesApi);
});

afterEach(() => {
    appContainer.restore();
});

const localVue = createLocalVue();
localVue.use(VueRouter);

const create = createWrapperFactory(App, {
    localVue,
    router: getVueRouter(),
    provide: {
        authTokenStorage: appContainer.get<MbLocalStorage>(TYPES.AuthTokenStorage),
        api: appContainer.get<Api>(TYPES.Api),
    }
});

const getLoginForm = () => wrapper.findComponent(LoginForm);
const getRouterView = () => wrapper.findComponent({name: `router-view`});

describe(`App`, () => {
   it(`Shows LoginForm if authentication is required`, () => {
       wrapper = create();

       expect(getLoginForm().exists()).toBe(true);
       expect(getRouterView().exists()).toBe(false);
   });

    it(`Shows RouterView if authentication is not required`, async () => {
        appContainer.rebind<MbLocalStorage>(TYPES.AuthTokenStorage).toConstantValue(new MbLocalStorage({
            initialValues: {
                [LocalStorageKey.AUTH_TOKEN]: {
                    defaultValue: `default-token`,
                },
            }
        }));
        wrapper = create({
            provide: {
                authTokenStorage: appContainer.get<MbLocalStorage>(TYPES.AuthTokenStorage),
                api: appContainer.get<Api>(TYPES.Api),
            }
        });
        await flushPromises();
        await Vue.nextTick();

        expect(getLoginForm().exists()).toBe(false);
        expect(wrapper.findComponent(NotesList).exists()).toBe(true);
    });
});
