import 'reflect-metadata';
import {Container} from 'inversify';
import FetchHttpClient from '@/inversify/injectables/fetch-http-client';
import MbLocalStorage from '@/inversify/injectables/local-storage/local-storage';
import FakeNotesApi from '@/inversify/injectables/fake-notes-api';
import NotesApi from '@/inversify/injectables/notes-api';

import {HttpClient, Api} from './interfaces';
import TYPES from './types';
import {LocalStorageKey} from '@/inversify/injectables/local-storage/model';

const appContainer = new Container();

appContainer.bind<Api>(TYPES.Api).to(FakeNotesApi);
appContainer.bind<HttpClient>(TYPES.HttpClient).to(FetchHttpClient);
appContainer.bind<MbLocalStorage>(TYPES.AuthTokenStorage).toConstantValue(new MbLocalStorage({
    initialValues: {
        [LocalStorageKey.AUTH_TOKEN]: {},
    }
}));

const api = appContainer.get<Api>(TYPES.Api);
const authTokenStorage = appContainer.get<MbLocalStorage>(TYPES.AuthTokenStorage);

export {appContainer, api, authTokenStorage};
