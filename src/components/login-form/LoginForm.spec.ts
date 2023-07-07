import VueRouter from 'vue-router';
import {Vue} from 'vue-property-decorator';
import {createLocalVue, Wrapper} from '@vue/test-utils'
import LoginForm from '@/components/login-form/LoginForm.vue';
import {loaderTestProvide} from '@/mixins/loader/loader-test-provide';
import {appContainer} from '@/inversify/inversify.config';
import FakeNotesApi from '@/inversify/injectables/fake-notes-api';
import NaLocalStorage from '@/inversify/injectables/local-storage/local-storage';
import {ServerError} from '@/inversify/injectables/fetch-http-client';
import getVueRouter from '@/router/router';
import {getInputWrapperByPlaceholder, getWrapperBySelectorText} from '../../../tests/utils';
import {createShallowWrapperFactory} from '../../../tests/create-wrapper-factory';

import {Api, GetJwtTokenResponse} from '@/inversify/interfaces';
import {NotesAppRouteName} from '@/router/route-name';

import TYPES from '@/inversify/types';
import {LocalStorageKey} from '@/inversify/injectables/local-storage/model';

jest.useFakeTimers();

let wrapper: Wrapper<LoginForm>;

const localVue = createLocalVue();
const getEmailInput = () => getInputWrapperByPlaceholder(wrapper, `email`);
const getPasswordInput = () => getInputWrapperByPlaceholder(wrapper, `password`);
const submitForm = async () => await wrapper.find(`form`).trigger(`submit`);

const createShallow = createShallowWrapperFactory(LoginForm, {
    localVue,
    router: getVueRouter(),
    provide: {
        ...loaderTestProvide,
    },
});

localVue.use(VueRouter);

describe(`LoginForm.vue`, () => {
    beforeEach(() => {
        appContainer.snapshot();
        appContainer.rebind<Api>(TYPES.Api).to(FakeNotesApi);
    });

    afterEach(() => {
        appContainer.restore();
        localStorage.clear();
    });

    it(`Renders form`, () => {
        wrapper = createShallow({
            provide: {
                api: appContainer.get<Api>(TYPES.Api),
                authTokenStorage: appContainer.get<NaLocalStorage>(TYPES.AuthTokenStorage),
            }
        });

        expect(getEmailInput().exists()).toBeTruthy();
        expect(getPasswordInput().exists()).toBeTruthy();
        expect(wrapper.text()).toMatch('Submit');
    });

    describe(`Submit`, () => {
        it(`Redirects to Notes view if got token`, async () => {
            wrapper = createShallow({
                provide: {
                    api: appContainer.get<Api>(TYPES.Api),
                    authTokenStorage: appContainer.get<NaLocalStorage>(TYPES.AuthTokenStorage),
                }
            });
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const onSubmitSpy = jest.spyOn(wrapper.vm, `onSubmit`)
            jest
                .spyOn(FakeNotesApi.prototype, 'getJwtToken')
                .mockImplementation((): Promise<GetJwtTokenResponse> => {
                    return Promise.resolve({
                        token: 'test-token'
                    });
                });
            const authTokenStorage = appContainer.get<NaLocalStorage>(TYPES.AuthTokenStorage);

            await getEmailInput().setValue(`test@test.ru`);
            await getPasswordInput().setValue(`testpassword`);
            await submitForm();

            expect(onSubmitSpy).toHaveBeenCalledTimes(1);
            await Vue.nextTick();
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            expect(authTokenStorage[LocalStorageKey.AUTH_TOKEN]).toBe('test-token');
            expect(wrapper.vm.$route.name).toBe(NotesAppRouteName.MAIN);
        });

        it(`Shakes button if got error while getting token`, async () => {
            wrapper = createShallow({
                provide: {
                    api: appContainer.get<Api>(TYPES.Api),
                    authTokenStorage: appContainer.get<NaLocalStorage>(TYPES.AuthTokenStorage),
                }
            });
            const submitButton = getWrapperBySelectorText(wrapper, 'button', 'Submit');
            jest
                .spyOn(appContainer.get<Api>(TYPES.Api), 'getJwtToken')
                .mockImplementation((): Promise<GetJwtTokenResponse> => {
                    return Promise.reject(new ServerError());
                });

            await getEmailInput().setValue(`test@test.ru`);
            await getPasswordInput().setValue(`testpassword`);
            await submitForm();

            expect(submitButton.classes().includes('na-shaking')).toBe(true);

            jest.runAllTimers();
            await Vue.nextTick();

            expect(submitButton.classes().includes('na-shaking')).toBe(false);
        });
    })
})
