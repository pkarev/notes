import {Wrapper} from '@vue/test-utils';
import {Vue} from 'vue-property-decorator';

export const getAllWrappersBySelectorsAndText = (wrapper: Wrapper<Vue>, selector: string, text: string) => {
    return wrapper.findAll(`${selector}`).filter(node => node.text() === text);
}

export const getWrapperBySelectorText = (wrapper: Wrapper<Vue>, selector: string, text: string) => {
    const results = getAllWrappersBySelectorsAndText(wrapper, selector, text);

    if (results.length === 0) {
        throw new Error(`getSelectorWithText() found no element with the text: "${text}".`);
    }

    return results.at(0);
}

export const getInputWrapperByPlaceholder = (wrapper: Wrapper<Vue>, placeholder: string) => {
    const input = wrapper.find(`input[placeholder=${placeholder}`);

    if (!input) {
        throw new Error(`getInputByPlaceholder() found no element with the placeholder: "${placeholder}".`);
    }

    return input;
}


