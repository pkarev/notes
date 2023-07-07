<style scoped lang="scss" src="./LoginForm.scss"></style>

<template>
    <div class="form__wrapper">
        <h1 class="form__title">Login</h1>
        <form @submit.prevent="onSubmit" class="form">
            <div class="form__row">
                <input class="form__input"
                       v-model="email"
                       type="text"
                       placeholder="email"
                       :disabled="isLoading"
                       required
                />
            </div>

            <div class="form__row">
                <input class="form__input"
                       v-model="password"
                       type="password"
                       placeholder="password"
                       required
                       :disabled="isLoading"
                />
            </div>

            <button class="form__submit"
                    :class="shakeClass(isSubmitButtonShaking)"
                    type="submit"
                    :disabled="isLoading"
            >
                Submit
            </button>
        </form>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata';
import {Mixins, Component, Inject, InjectReactive} from 'vue-property-decorator';
import ShakeMixin from '@/mixins/shake/Shake';
import {NotesAppRouteName} from '@/router/route-name';
import {isApiError} from '@/inversify/injectables/fetch-http-client';

import {Api, GetJwtTokenRequest} from '@/inversify/interfaces';
import {LocalStorageKey} from '@/inversify/injectables/local-storage/model';
import MbLocalStorage from '@/inversify/injectables/local-storage/local-storage';

@Component
export default class LoginForm extends Mixins(ShakeMixin) {
    @InjectReactive() isLoading!: boolean;
    @Inject() load: (callback: () => Promise<void>) => Promise<void>
    @Inject() api: Api;
    @Inject() authTokenStorage: MbLocalStorage;

    email = '';
    password = '';
    isSubmitButtonShaking = false;

    async onSubmit(): Promise<void> {
        await this.load(async () => {
            await this.login({
                email: this.email,
                password: this.password,
            });
        });
    }

    private async login(params: GetJwtTokenRequest): Promise<void> {
        try {
            const {token} = await this.api.getJwtToken(params);
            this.authTokenStorage.setItem(LocalStorageKey.AUTH_TOKEN, token);
            this.goToMain();

        } catch (e) {
            this.notifyError();

            if (!isApiError(e)) {
                throw e;
            }
        }
    }

    private notifyError(): void {
        this.shakeElement(`isSubmitButtonShaking`);
    }

    private goToMain(): void {
        this.$router.push({
            name: NotesAppRouteName.MAIN,
        });
    }
}
</script>

