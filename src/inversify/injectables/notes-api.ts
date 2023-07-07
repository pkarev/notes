import 'reflect-metadata';
import {inject, injectable} from 'inversify';

import {
    Api, Email,
    GetJwtTokenRequest,
    GetJwtTokenResponse,
    GetNotesResponse,
    HttpClient,
    NoteItem
} from '@/inversify/interfaces';
import TYPES from '@/inversify/types';
import MbLocalStorage from '@/inversify/injectables/local-storage/local-storage';
import {LocalStorageKey} from '@/inversify/injectables/local-storage/model';

@injectable()
export default class NotesApi implements Api {
    private _httpClient: HttpClient;
    private _authTokenStorage: MbLocalStorage;

    constructor(
        @inject(TYPES.HttpClient) fetchHttpClient: HttpClient,
        @inject(TYPES.AuthTokenStorage) authTokenStorage: MbLocalStorage
    ) {
        this._httpClient = fetchHttpClient;
        this._authTokenStorage = authTokenStorage;
    }

    private get authHeader(): Record<string, string> {
        return {
            Authorization: `Bearer ${this._authTokenStorage.getItem(LocalStorageKey.AUTH_TOKEN)}`,
        }
    }

    public async getJwtToken(request: GetJwtTokenRequest): Promise<GetJwtTokenResponse> {
        const apiRequest: RequestInit = {
            body: JSON.stringify(request),
            method: `post`,
        }

        return await this._httpClient.request<GetJwtTokenResponse>(`https://notesapi.io/api/v2/users/login`, apiRequest);
    }

    public async getNotes(): Promise<GetNotesResponse> {
        const apiRequest: RequestInit = {
            method: 'get',
            headers: {
                ...this.authHeader,
            }
        }

        return await this._httpClient.request<GetNotesResponse>(`https://notesapi.io/api/v2/notes`, apiRequest);
    }

    public async createNote(request: NoteItem): Promise<NoteItem> {
        const apiRequest: RequestInit = {
            body: JSON.stringify(request),
            method: 'post',
            headers: {
                ...this.authHeader,
            }
        }

        return await this._httpClient.request(`https://notesapi.io/api/v2/notes`, apiRequest);
    }

    public async removeNote(id: string): Promise<void> {
        const apiRequest: RequestInit = {
            method: `delete`,
            headers: {
                ...this.authHeader,
            }
        }

        return await this._httpClient.request(`https://notesapi.io/api/v2/notes/${id}`, apiRequest);
    }

    public async updateNote(note: NoteItem): Promise<void> {
        const apiRequest: RequestInit = {
            body: JSON.stringify(note),
            method: `put`,
            headers: {
                ...this.authHeader,
            }
        }

        return await this._httpClient.request(`https://notesapi.io/api/v2/notes/${note.id}`, apiRequest);
    }

    public async getEmails(): Promise<Email[]> {
        const apiRequest: RequestInit = {
            method: `get`,
            headers: {
                ...this.authHeader,
            }
        }

        return await this._httpClient.request(`https://notesapi.io/api/v2/emails`, apiRequest);
    }
}
