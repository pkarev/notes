import VueRouter from 'vue-router';
import {notesAppRoutes} from '@/router/routes';
import {NotesAppRouteName} from '@/router/route-name';

const getVueRouter = (): VueRouter => {
    const createdRouter = new VueRouter({
        routes: notesAppRoutes,
        mode: `history`,
        base: `/`,
    });

    createdRouter.beforeResolve((to, from, next) => {
        if (to.name) {
            if ((<string[]>Object.values(NotesAppRouteName)).includes(to.name)) {
                next();
                return;
            }
        }

        next({name: NotesAppRouteName.NOT_FOUND});
    });

    return createdRouter;
}

export default getVueRouter;
