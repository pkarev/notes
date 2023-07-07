import VueRouter from 'vue-router';
import {createLocalVue, Wrapper} from '@vue/test-utils';
import NotesList from '@/components/notes-list/NotesList.vue';
import {createShallowWrapperFactory} from '../../../tests/create-wrapper-factory';
import getVueRouter from '@/router/router';
import {loaderTestProvide} from '@/mixins/loader/loader-test-provide';
import {appContainer} from '@/inversify/inversify.config';
import {Api, GetNotesResponse} from '@/inversify/interfaces';
import TYPES from '@/inversify/types';
import FakeNotesApi from '@/inversify/injectables/fake-notes-api';
import MbLocalStorage from '@/inversify/injectables/local-storage/local-storage';
import flushPromises from 'flush-promises';
import {getWrapperBySelectorText} from '../../../tests/utils';
import {Vue} from 'vue-property-decorator';
import {ServerError} from '@/inversify/injectables/fetch-http-client';

let wrapper: Wrapper<NotesList>;

const localVue = createLocalVue();
localVue.use(VueRouter);

const createShallow = createShallowWrapperFactory(NotesList, {
    localVue,
    router: getVueRouter(),
    provide: {
        ...loaderTestProvide,
    },
    propsData: {
        email: {
            identifiers: {
                message_id: ``,
                gmail_message_id: ``,
                gmail_draft_id: ``,
                gmail_thread_id: ``,
                notes_message_id: ``,
            }
        }
    }
});

jest.useFakeTimers();

describe(`NotesList`, () => {
    beforeEach(() => {
        appContainer.snapshot();
        appContainer.rebind<Api>(TYPES.Api).to(FakeNotesApi);
    });

    afterEach(() => {
        appContainer.restore();
        localStorage.clear();
    });

    describe(`When loaded notes`, () => {
        it(`Renders component`, async () => {
            wrapper = createShallow({
                provide: {
                    api: appContainer.get<Api>(TYPES.Api),
                    authTokenStorage: appContainer.get<MbLocalStorage>(TYPES.AuthTokenStorage),
                }
            });

            await flushPromises();

            expect(wrapper.text()).toMatch(`Notes list`);
            expect(wrapper.text()).toMatch(`New note`);
            expect(wrapper.find(`textarea`).exists()).toBe(true);
        });

        describe(`Add note`, () => {
            it(`Adds note`, async () => {
                wrapper = createShallow({
                    provide: {
                        api: appContainer.get<Api>(TYPES.Api),
                        authTokenStorage: appContainer.get<MbLocalStorage>(TYPES.AuthTokenStorage),
                    }
                });

                await flushPromises();

                const addNoteButton = getWrapperBySelectorText(wrapper, `button`, `New note`);
                await addNoteButton.trigger(`click`);

                await flushPromises();

                expect(wrapper.findAll(`textarea`).length).toBe(2);
            });

            it(`Shakes add note button if got error`, async () => {
                const api = appContainer.get<Api>(TYPES.Api);
                jest
                    .spyOn(api, 'createNote')
                    .mockImplementation(() => {
                        return Promise.reject(new ServerError());
                    })
                wrapper = createShallow({
                    provide: {
                        api,
                        authTokenStorage: appContainer.get<MbLocalStorage>(TYPES.AuthTokenStorage),
                    }
                });

                const addNoteButton = getWrapperBySelectorText(wrapper, `button`, `New note`);
                await addNoteButton.trigger(`click`);
                await Vue.nextTick();

                expect(addNoteButton.classes().includes(`na-shaking`)).toBe(true);

                jest.runAllTimers();
                await Vue.nextTick();

                expect(addNoteButton.classes().includes(`na-shaking`)).toBe(false);
            });
        });

        describe(`Remove note`, () => {
           it(`Removes note`, async() => {
               wrapper = createShallow({
                   provide: {
                       api: appContainer.get<Api>(TYPES.Api),
                       authTokenStorage: appContainer.get<MbLocalStorage>(TYPES.AuthTokenStorage),
                   }
               });

               await flushPromises();

               const removeNoteButton = getWrapperBySelectorText(wrapper, `button`, `x`);
               await removeNoteButton.trigger(`click`);

               await flushPromises();

               expect(wrapper.findAll(`textarea`).length).toBe(0);
           });

            it(`Shakes note on error`, async() => {
                const api = appContainer.get<Api>(TYPES.Api);
                jest
                    .spyOn(api, 'removeNote')
                    .mockImplementation(() => {
                        return Promise.reject(new ServerError());
                    })

                wrapper = createShallow({
                    provide: {
                        api,
                        authTokenStorage: appContainer.get<MbLocalStorage>(TYPES.AuthTokenStorage),
                    }
                });

                await flushPromises();

                const removeNoteButton = getWrapperBySelectorText(wrapper, `button`, `x`);
                const note = wrapper.find(`textarea`);
                await removeNoteButton.trigger(`click`);
                await Vue.nextTick();

                expect(wrapper.findAll(`textarea`).length).toBe(1);
                expect(note.classes().includes(`na-shaking`)).toBe(true);

                jest.runAllTimers();
                await Vue.nextTick();

                expect(note.classes().includes(`na-shaking`)).toBe(false);
            });
        });

        describe(`Update note`, () => {
            it(`Updates note`, async() => {
                wrapper = createShallow({
                    provide: {
                        api: appContainer.get<Api>(TYPES.Api),
                        authTokenStorage: appContainer.get<MbLocalStorage>(TYPES.AuthTokenStorage),
                    }
                });

                await flushPromises();

                const note = wrapper.find(`textarea`);
                await note.setValue('New value');

                await flushPromises();
                jest.runOnlyPendingTimers();
                await Vue.nextTick();

                expect((note.element as HTMLTextAreaElement).value).toBe(`New value`);
                expect(note.classes().includes(`na-shaking`)).toBe(false);
            });

            it(`Shakes note on update error`, async () => {
                const api = appContainer.get<Api>(TYPES.Api);
                jest
                    .spyOn(api, `updateNote`)
                    .mockImplementation(() => {
                       return Promise.reject(new ServerError());
                    });

                wrapper = createShallow({
                    provide: {
                        api,
                        authTokenStorage: appContainer.get<MbLocalStorage>(TYPES.AuthTokenStorage),
                    }
                });

                await flushPromises();

                const note = wrapper.find(`textarea`);
                await note.setValue('New value');

                await flushPromises();
                jest.runOnlyPendingTimers();
                await Vue.nextTick();

                expect((note.element as HTMLTextAreaElement).value).toBe(`New value`);
                expect(note.classes().includes(`na-shaking`)).toBe(true);

                jest.runAllTimers();
                await Vue.nextTick();

                expect(note.classes().includes(`na-shaking`)).toBe(false);
            });
        })
    });

    describe(`When loaded empty array of notes`, () => {
        it(`Renders component`, async () => {
            const api = appContainer.get<Api>(TYPES.Api);
            jest
                .spyOn(api, 'getNotes')
                .mockImplementation((): Promise<GetNotesResponse> => {
                    return Promise.resolve([]);
                });

            wrapper = createShallow({
                provide: {
                    api,
                    authTokenStorage: appContainer.get<MbLocalStorage>(TYPES.AuthTokenStorage),
                }
            });

            await flushPromises();

            expect(wrapper.text()).toMatch(`Notes list`);
            expect(wrapper.text()).toMatch(`No notes`);
            expect(wrapper.text()).toMatch(`New note`);
            expect(wrapper.find('textarea').exists()).toBe(false);
        });
    });

    describe(`When got error while loading notes`, () => {
        it(`Renders component`, async () => {
            const api = appContainer.get<Api>(TYPES.Api);
            jest
                .spyOn(api, 'getNotes')
                .mockImplementation((): Promise<GetNotesResponse> => {
                    return Promise.reject(new ServerError());
                });

            wrapper = createShallow({
                provide: {
                    api,
                    authTokenStorage: appContainer.get<MbLocalStorage>(TYPES.AuthTokenStorage),
                }
            });

            await flushPromises();

            expect(wrapper.text()).toMatch(`Notes list`);
            expect(wrapper.text()).toMatch(`An error occurred while loading notes`);
            expect(wrapper.find(`textarea`).exists()).toBe(false);

            const retryButton = getWrapperBySelectorText(wrapper, `button`, `Retry`);
            await retryButton.trigger(`click`);
            await Vue.nextTick();

            expect(retryButton.classes().includes(`na-shaking`)).toBe(true);

            jest.runAllTimers();
            await Vue.nextTick();

            expect(retryButton.classes().includes(`na-shaking`)).toBe(false);
        });
    });
});
