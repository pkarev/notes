export interface HttpClient {
    request<ResponseType = null>(
        url: string,
        request?: RequestInit,
    ): Promise<ResponseType>;
}

export interface Api {
    getJwtToken(request: GetJwtTokenRequest): Promise<GetJwtTokenResponse>;
    getNotes(): Promise<GetNotesResponse>;
    createNote(note: NoteItem): Promise<NoteItem>;
    removeNote(id: string): Promise<void>;
    updateNote(note: NoteItem): Promise<void>;
    getEmails(): Promise<Email[]>;
}

export interface AuthTokenResolver {
    resolve(): string;
}

export class HTTPResponseError extends Error {
    private response: Response;

    constructor(response: Response) {
        super(`HTTP Error Response: ${response.status} ${response.statusText}`);
        this.response = response;
    }
}

export type GetJwtTokenRequest = {
    email: string;
    password: string;
}

export interface GetJwtTokenResponse {
    token: string;
}

export type GetNotesResponse = NoteItem[];

export type NoteItem = {
    text: string;
    id: string;
    context: ItemContext;
}

export type ItemContext = {
    message_id: string;
    gmail_message_id: string;
    gmail_draft_id?: string;
    notes_message_id?: string;
    contact_id?: string;
}

export type Email = {
    identifiers: {
        message_id: string;
        gmail_message_id: string;
        gmail_draft_id: string;
        gmail_thread_id: string;
        notes_message_id: string;
    }
}
