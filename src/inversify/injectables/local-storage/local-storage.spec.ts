import {LocalStorageKey, MbLocalStorageParams} from '@/inversify/injectables/local-storage/model';
import MbLocalStorage, {DEFAULT_MB_LOCAL_STORAGE_NAME_SPACE} from '@/inversify/injectables/local-storage/local-storage';

const create = (mbLocalStorageParams?: Partial<MbLocalStorageParams>) => new MbLocalStorage({
    initialValues: {
        [LocalStorageKey.AUTH_TOKEN]: {},
    },
    ...mbLocalStorageParams,
});

const TEST_DEFAULT_VALUE = `test-value`;
const TEST_LOCAL_STORAGE_INITIAL_VALUE = `test-localstorage-initial-value`;
const TEST_NEW_VALUE = `test-new-value`;
const TEST_NAMESPACE = `testNamespace`;

let storage;
const getStorageItem = (name: string) => localStorage.getItem(name);
const setStorageItem = (name: string, value: string) => localStorage.setItem(name, value);

describe(`MbLocalStorage`, () => {
    afterEach(() => {
        localStorage.clear();
    })

    describe(`Gets items`, () => {
        it(`Gets null if property is not defined`, () => {
            storage = create();
            expect(storage.getItem(LocalStorageKey.AUTH_TOKEN)).toBe(null);
            localStorage.clear();
        });

        it(`Gets default value if property was set via default value`, () => {
            storage = create({
                initialValues: {
                    [LocalStorageKey.AUTH_TOKEN]: {
                        defaultValue: TEST_DEFAULT_VALUE,
                    },
                }
            });

            expect(storage.getItem(LocalStorageKey.AUTH_TOKEN)).toBe(TEST_DEFAULT_VALUE);
            localStorage.clear();
        });

        it(`Gets local storage initial value if property was set both default and in local storage`, () => {
            setStorageItem(`${DEFAULT_MB_LOCAL_STORAGE_NAME_SPACE}.${LocalStorageKey.AUTH_TOKEN}`, TEST_LOCAL_STORAGE_INITIAL_VALUE);
            storage = create({
                initialValues: {
                    [LocalStorageKey.AUTH_TOKEN]: {
                        defaultValue: TEST_DEFAULT_VALUE,
                    },
                }
            });

            expect(storage.getItem(LocalStorageKey.AUTH_TOKEN)).toBe(TEST_LOCAL_STORAGE_INITIAL_VALUE);
            localStorage.clear();
        });

        it(`Gets local storage initial value if property was set only in local storage`, () => {
            setStorageItem(`${DEFAULT_MB_LOCAL_STORAGE_NAME_SPACE}.${LocalStorageKey.AUTH_TOKEN}`, TEST_LOCAL_STORAGE_INITIAL_VALUE);
            storage = create();

            expect(storage.getItem(LocalStorageKey.AUTH_TOKEN)).toBe(TEST_LOCAL_STORAGE_INITIAL_VALUE);
            localStorage.clear();
        });
    });

    describe(`Sets items`, () => {
        it(`Sets predefined initial key`, () => {
            storage = create();
            storage.setItem(LocalStorageKey.AUTH_TOKEN, TEST_NEW_VALUE);
            expect(storage.getItem(LocalStorageKey.AUTH_TOKEN)).toBe(TEST_NEW_VALUE);
            localStorage.clear();
        })
    });

    it(`Sets items in given namespace`, () => {
        storage = create({
            namespace: TEST_NAMESPACE,
        });

        storage.setItem(LocalStorageKey.AUTH_TOKEN, TEST_NEW_VALUE);
        expect(getStorageItem(`${TEST_NAMESPACE}.${LocalStorageKey.AUTH_TOKEN}`)).toBe(TEST_NEW_VALUE);
        expect(storage.getItem(LocalStorageKey.AUTH_TOKEN)).toBe(TEST_NEW_VALUE);
        localStorage.clear();
    });

    it(`Removes items`, () => {
        storage = create({
            initialValues: {
                [LocalStorageKey.AUTH_TOKEN]: {
                    defaultValue: TEST_DEFAULT_VALUE,
                },
            }
        });

        expect(storage.getItem(LocalStorageKey.AUTH_TOKEN)).toBe(TEST_DEFAULT_VALUE);
        storage.removeItem(LocalStorageKey.AUTH_TOKEN);
        expect(storage.getItem(LocalStorageKey.AUTH_TOKEN)).toBe(null);
    })

    it(`Updates values on storage event`, () => {
        const customEvent = new StorageEvent(`storage`, {
            key: `${DEFAULT_MB_LOCAL_STORAGE_NAME_SPACE}.${LocalStorageKey.AUTH_TOKEN}`,
            newValue: TEST_NEW_VALUE,
        })

        storage = create();
        window.dispatchEvent(customEvent);

        expect(storage.getItem(LocalStorageKey.AUTH_TOKEN)).toBe(TEST_NEW_VALUE);
    });
});
