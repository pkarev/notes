import '@/styles/index.scss';
import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import getVueRouter from '@/router/router';
import {api, authTokenStorage} from '@/inversify/inversify.config';

Vue.config.productionTip = false;
Vue.use(VueRouter);

new Vue({
    render: h => h(App),
    router: getVueRouter(),
    provide: {
        authTokenStorage,
        api,
    }
}).$mount(`#app`);
