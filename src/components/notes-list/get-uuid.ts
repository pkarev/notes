import {v4 as uuidv4} from 'uuid';
import {NoteItem} from '@/inversify/interfaces';

export const getNewNoteUuid = (notes: NoteItem[]): string => {
    const uuid = uuidv4();

    if (notes.some((note) => note.id === uuid)) {
        return getNewNoteUuid(notes);
    }

    return uuid;
}
