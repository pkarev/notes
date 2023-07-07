import {isArray, mergeWith, omit} from 'lodash';
import {mount, MountOptions, shallowMount, Wrapper} from '@vue/test-utils';
import {VueConstructor} from 'vue';

const arrayMergeRule = (objValue: any, srcValue: any) => {
    if (isArray(objValue)) {
        return srcValue;
    }
}

export const createWrapperFactory = (component: VueConstructor, defaultCreateWrapperParams: MountOptions<any> = {}) => {
    return (createWrapperParams: MountOptions<any> = {}): Wrapper<any> => {
        return mount(component, {
            ...mergeWith({}, defaultCreateWrapperParams, omit(createWrapperParams, `provide`), arrayMergeRule),
            provide: {
                ...defaultCreateWrapperParams?.provide,
                ...createWrapperParams?.provide,
            },
        });
    }
};

export const createShallowWrapperFactory = (component: VueConstructor, defaultCreateWrapperParams: MountOptions<any> = {}) => {
    return (createWrapperParams: MountOptions<any> = {}): Wrapper<any> => {
        return shallowMount(component, {
            ...mergeWith({}, defaultCreateWrapperParams, omit(createWrapperParams, `provide`), arrayMergeRule),
            provide: {
                ...defaultCreateWrapperParams?.provide,
                ...createWrapperParams?.provide,
            },
        });
    }
};
