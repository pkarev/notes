import 'reflect-metadata';
import {inject, injectable} from 'inversify';
import {HttpClient} from '@/inversify/interfaces';
import TYPES from '@/inversify/types';
import MbLocalStorage from '@/inversify/injectables/local-storage/local-storage';
import {LocalStorageKey} from '@/inversify/injectables/local-storage/model';

@injectable()
export default class FetchHttpClient implements HttpClient {
    private _authTokenStorage: MbLocalStorage

    constructor(
        @inject(TYPES.AuthTokenStorage) authTokenStorage: MbLocalStorage
    ) {
        this._authTokenStorage = authTokenStorage;
    }

    async request<ResponseType>(serviceApiUrl: string, request: RequestInit): Promise<ResponseType> {
        const response = await fetch(serviceApiUrl, {
            ...request,
            headers: {
                ...request.headers,
                'Content-Type': `application/json`,
            }
        });

        const responseText = await response.text();

        if (!responseText) {
            return Promise.resolve(<ResponseType><unknown>null);
        }

        if (response.ok) {
            return responseText ?
                await JSON.parse(responseText) as ResponseType:
                <ResponseType><unknown>null;
        }

        if (!response.status) {
            return Promise.reject(new NoInternetConnectionError())
        }

        if (response.status === 401) {
            this._authTokenStorage.removeItem(LocalStorageKey.AUTH_TOKEN);

            return Promise.reject(new AuthorizationRequired());
        }

        return Promise.reject(new ServerError());
    }
}

export class AuthorizationRequired extends Error {
    constructor() {
        super(`Authorization required`)
        Object.setPrototypeOf(this, AuthorizationRequired.prototype)
    }
}

export class NoInternetConnectionError extends Error {
    constructor() {
        super(`No internet connection`)
        Object.setPrototypeOf(this, NoInternetConnectionError.prototype)
    }
}

export class ServerError extends Error {
    constructor() {
        super(`Server error`)
        Object.setPrototypeOf(this, ServerError.prototype)
    }
}

export const API_ERRORS = [AuthorizationRequired, NoInternetConnectionError, ServerError];

export const isApiError = (e: any) => {
    return API_ERRORS.some((errorConstructor) => e instanceof errorConstructor);
}
