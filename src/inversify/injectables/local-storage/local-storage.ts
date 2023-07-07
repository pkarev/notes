import Vue from 'vue';
import {MbLocalStorageParams} from '@/inversify/injectables/local-storage/model';
import 'reflect-metadata';
import {injectable} from 'inversify';

export const DEFAULT_MB_LOCAL_STORAGE_NAME_SPACE = `notesApp`;

@injectable()
export default class MbLocalStorage {
    private store: { values: Record<string, string | null> } = Vue.observable({
        values: {}
    });
    readonly namespace: string;
    readonly isUpdateOnStorageEventMode: boolean;

    constructor({initialValues, namespace, isUpdateOnStorageEventMode}: MbLocalStorageParams) {
        this.namespace = namespace || DEFAULT_MB_LOCAL_STORAGE_NAME_SPACE;
        this.isUpdateOnStorageEventMode = isUpdateOnStorageEventMode || true;

        Object.keys(initialValues).forEach((key) => {
            const localStorageKey = `${this.namespace}.${key}`;
            const preStoredValue = localStorage.getItem(localStorageKey);
            const fallBackValue = initialValues[key].defaultValue !== undefined ?
                initialValues[key].defaultValue :
                null;

            Vue.set(this.store.values, key, preStoredValue !== null ? preStoredValue : fallBackValue);

            Object.defineProperty(this, key, {
                get() {
                    return this.store.values[key];
                },
                set(value: string) {
                    this.store.values[key] = value;
                    localStorage.setItem(localStorageKey, value);
                },
                enumerable: true,
            });
        });

        if (this.isUpdateOnStorageEventMode) {
            window.addEventListener(`storage`, ({key, newValue}) => {
                const updatedKey = Object.keys(this.store.values).find((storeKey) => {
                    return `${this.namespace}.${storeKey}` === key;
                });

                if (!updatedKey) {
                    return;
                }

                Vue.set(this.store.values, updatedKey, newValue);
            });
        }
    }

    removeItem(key: string): void {
        localStorage.removeItem(`${this.namespace}.${key}`);

        // eslint-disable-next-line no-prototype-builtins
        if (this.store.values.hasOwnProperty(key)) {
            this.store.values[key] = null;
        }
    }

    getItem(key: string): string {
        if (Object.getOwnPropertyDescriptor(this, key)) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return this[key];
        }

        return '';
    }

    setItem(key: string, value: string): void {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this[key] = value;
    }
}
