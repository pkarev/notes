import {debounce} from 'lodash';

export function asyncDebounce<
    F extends (...args: any[]) => Promise<any>
>(func: F, wait?: number) {
    const throttled = debounce((resolve, reject, args: Parameters<F>) => {
        func(...args).then(resolve).catch(reject);
    }, wait);
    return (...args: Parameters<F>): ReturnType<F> =>
        new Promise((resolve, reject) => {
            throttled(resolve, reject, args);
        }) as ReturnType<F>;
}
