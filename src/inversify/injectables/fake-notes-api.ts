import {v4 as uuidv4} from 'uuid';
import 'reflect-metadata';
import {injectable} from 'inversify';

import {Api, Email, GetJwtTokenResponse, GetNotesResponse, ItemContext, NoteItem} from '@/inversify/interfaces';

const defaultContext: ItemContext = {
    message_id: '',
    gmail_message_id: '',
    gmail_draft_id: '',
    notes_message_id: '',
    contact_id: ''
};

@injectable()
export default class FakeNotesApi implements Api {
    public async getJwtToken(): Promise<GetJwtTokenResponse> {
        return Promise.resolve({
            token: `test-token`,
        })
    }

    public async getNotes(): Promise<GetNotesResponse> {
        return Promise.resolve([
            {
                id: uuidv4(),
                text: `First note`,
                context: defaultContext,
            },
        ]);
    }

    public async createNote(): Promise<NoteItem> {
        return Promise.resolve({
            id: uuidv4(),
            text: `First note`,
            context: defaultContext,
        });
    }

    public async removeNote(): Promise<void>
    {
        return Promise.resolve();
    }

    public async updateNote(): Promise<void> {
        return Promise.resolve();
    }

    public async getEmails(): Promise<Email[]> {
        return Promise.resolve([
            {
                identifiers: {
                    message_id: ``,
                    gmail_message_id: ``,
                    gmail_draft_id: ``,
                    gmail_thread_id: ``,
                    notes_message_id: ``,
                }
            }
        ]);
    }
}
