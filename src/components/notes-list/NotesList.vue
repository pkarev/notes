<style scoped lang="scss" src="./NotesList.scss"></style>

<template>
    <div class="notes-list__wrapper">
        <h1 class="notes-list__title">Notes list</h1>
        <template v-if="!isGetNotesError">
            <ul class="notes-list" v-if="notes.length">
                <li class="notes-list__item" v-for="(note, index) in notes" :key="note.id ">
                    <textarea class="notes-list__textarea" :class="shakeClass(notesRemoveShakingById[note.id])"
                              v-model="notes[index].text"
                              placeholder="Add Note"
                              @input="debouncedOnNoteUpdate(note)"
                              :disabled="isLoading"
                    />
                    <button class="notes-list__remove-button"
                            type="button"
                            @click="onRemoveNote(note)"
                            title="Remove note"
                            :disabled="isLoading"
                    >
                        x
                    </button>
                </li>
            </ul>

            <p class="notes-list__empty" v-else-if="!isLoading">
                No notes
            </p>

            <button class="notes-list__add-new" :class="shakeClass(isAddNoteElementShaking)" type="button"
                    @click="onAddNote"
                    :disabled="isLoading"
            >
                New note
            </button>
        </template>

        <template v-else>
            <p>An error occurred while loading notes</p>

            <button class="notes__retry"
                    :class="shakeClass(isRetryButtonShaking)"
                    type="button"
                    @click="onGetNotes"
                    :disabled="isLoading"
            >
                Retry
            </button>
        </template>
    </div>
</template>

<script lang="ts">
import {Component, Inject, InjectReactive, Mixins, Prop, Watch} from 'vue-property-decorator';
import {Api, Email, ItemContext, NoteItem} from '@/inversify/interfaces';
import {getNewNoteUuid} from '@/components/notes-list/get-uuid';
import ShakeMixin from '@/mixins/shake/Shake';
import {isApiError} from '@/inversify/injectables/fetch-http-client';
import {asyncDebounce} from '@/utils';

const ON_NOTE_CHANGE_DEBOUNCE_TIME = 500;
const defaultItemContext: ItemContext = {
    message_id: '',
    gmail_message_id: '',
    gmail_draft_id: '',
    notes_message_id: '',
    contact_id: ''
};

@Component
export default class NotesList extends Mixins(ShakeMixin) {
    @InjectReactive() isLoading!: boolean;
    @Inject() load: (callback: () => Promise<void>) => Promise<void>
    @Inject() api: Api;
    @Prop({required: true}) email: Email;

    notes: NoteItem[] = [];
    isGetNotesError = false;
    isAddNoteElementShaking = false;
    isRetryButtonShaking = false;

    notesRemoveShakingById: Record<string, boolean> = {};
    debouncedOnNoteUpdate: (note: NoteItem) => Promise<void>;

    async mounted(): Promise<void> {
        await this.onGetNotes();
    }

    async created(): Promise<void> {
        this.debouncedOnNoteUpdate = asyncDebounce(async (note: NoteItem) => {
            await this.onNoteUpdate(note);
        }, ON_NOTE_CHANGE_DEBOUNCE_TIME);
    }

    @Watch('notes', {deep: true})
    onNotesChange(): void {
        let updatedNotesRemoveStatus: Record<string, boolean> = {}
        this.notes.map((note) => {
            updatedNotesRemoveStatus[note.id] = false;
        });

        this.$set(this, `notesRemoveShakingById`, updatedNotesRemoveStatus);
    }

    private async onAddNote(): Promise<void> {
        await this.load(async () => {
            await this.addNote();
        });
    }

    private async addNote(): Promise<void> {
        const newNote = {
            id: getNewNoteUuid(this.notes),
            text: `New note`,
            context: {
                message_id: this.email.identifiers.message_id,
                gmail_message_id: this.email.identifiers.gmail_message_id,
            }
        };

        try {
            const createdNote = await this.api.createNote(newNote);
            this.notes.push(createdNote);
        } catch (e) {
            this.notifyAddNoteError();

            if (!isApiError(e)) {
                throw e;
            }
        }
    }

    private notifyAddNoteError(): void {
        this.shakeElement(`isAddNoteElementShaking`);
    }

    private async onGetNotes(): Promise<void> {
        await this.load(async () => {
            this.isGetNotesError = false;
            await this.getNotes();
        });
    }

    private async getNotes(): Promise<void> {
        try {
            this.notes = await this.api.getNotes();

        } catch (e) {
            this.isGetNotesError = true;
            this.shakeElement('isRetryButtonShaking')

            if (!isApiError(e)) {
                throw e;
            }
        }
    }

    private async onRemoveNote(note: NoteItem): Promise<void> {
        await this.load(async () => this.removeNote(note));
    }

    private async removeNote(note: NoteItem): Promise<void> {
        try {
            const id = note.id;
            await this.api.removeNote(id);
            this.notes = this.notes.filter((note) => note.id !== id);

        } catch (e) {
            this.shakeElementByNestedModel(`notesRemoveShakingById.${note.id}`);

            if (!isApiError(e)) {
                throw e;
            }
        }
    }

    private async onNoteUpdate(note: NoteItem): Promise<void> {
        try {
            await this.api.updateNote(note)

        } catch (e) {
            this.shakeElementByNestedModel(`notesRemoveShakingById.${note.id}`);

            if (!isApiError(e)) {
                throw e;
            }
        }
    }
}
</script>
