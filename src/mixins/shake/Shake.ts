import {Vue, Component} from 'vue-property-decorator';

const SHAKING_ANIMATION_DURATION = 777;

@Component
export default class ShakeMixin extends Vue {
    shakeClass(isShaking: boolean): Record<string, boolean> {
        return {
            'na-shaking': isShaking,
        }
    }

    shakeElement(isShakingModel: string): void {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this[isShakingModel] = true;

        setTimeout(() => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this[isShakingModel] = false;
        }, SHAKING_ANIMATION_DURATION);
    }

    shakeElementByNestedModel(isShakingNestedModel: string): void {
        const pathParts = isShakingNestedModel.split('.');
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore

        this.$set(this[pathParts[0]], `${pathParts[1]}`, true);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore

        setTimeout(() => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this.$set(this[pathParts[0]], `${pathParts[1]}`, false);
        }, SHAKING_ANIMATION_DURATION);
    }
}
