<template>
    <div class="app" id="app">
        <LoginForm v-if="isAuthenticationRequired"/>

        <template v-else>
            <router-view class="app__view" :email="activeEmail" v-if="activeEmail"/>

            <template v-else-if="!isLoading">
                <h3 class="app__notification-title">
                    Impossible to manage notes!
                </h3>
                <p class="app__notification-text">
                    There is no emails in given gmail account.
                </p>
            </template>
        </template>


        <button class="app__logout"
                type="button"
                :disabled="isLoading"
                @click="onLogout"
                v-if="!isAuthenticationRequired"
        >
            Logout
        </button>
    </div>
</template>

<script lang="ts">
import {Component, Inject, InjectReactive, Mixins, Watch} from 'vue-property-decorator';
import LoginForm from '@/components/login-form/LoginForm.vue';
import LoaderMixin from '@/mixins/loader/Loader';
import MbLocalStorage from '@/inversify/injectables/local-storage/local-storage';
import {LocalStorageKey} from '@/inversify/injectables/local-storage/model';
import {Api, Email} from '@/inversify/interfaces';
import {isApiError} from '@/inversify/injectables/fetch-http-client';

@Component({
    components: {
        LoginForm
    },
})
export default class App extends Mixins(LoaderMixin) {
    @Inject('authTokenStorage') storage: MbLocalStorage;
    @Inject() api: Api;

    emails: Email[] = [];

    get activeEmail(): Email | null
    {
        return this?.emails?.[0] || null;
    }

    get isAuthenticationRequired(): boolean
    {
        return !this.storage.getItem(LocalStorageKey.AUTH_TOKEN);
    }

    private onLogout(): void
    {
        this.storage.removeItem(LocalStorageKey.AUTH_TOKEN);
    }

    private async loadEmails(): Promise<void>
    {
        try {
            this.emails = await this.api.getEmails();

        } catch (e) {
            if (!isApiError(e)) {
                throw e;
            }
        }
    }

    @Watch('isAuthenticationRequired', {immediate: true})
    async onIsAuthenticationRequiredChange(): Promise<void>
    {
        if (this.isAuthenticationRequired) {
             return;
        }

        await this.load(async () => {
           await this.loadEmails();
        });
    }
}
</script>

<style lang="scss" scoped src="./App.scss"></style>
