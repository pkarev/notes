import {NotesAppRouteName} from '@/router/route-name';

import PageIsNotFound from '@/components/page-is-not-found/PageIsNotFound.vue';
import NotesList from '@/components/notes-list/NotesList.vue';

export const notesAppRoutes = [
    {
        path: `/`,
        name: NotesAppRouteName.MAIN,
        component: NotesList,
    },
    {
        path: `/not-found`,
        name: NotesAppRouteName.NOT_FOUND,
        component: PageIsNotFound,
    }
]
