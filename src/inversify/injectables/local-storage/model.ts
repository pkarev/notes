export enum LocalStorageKey {
    AUTH_TOKEN = 'authToken',
}

export type MbLocalStorageParams = {
    initialValues: Record<string, InitialValue>;
    namespace?: string;
    isUpdateOnStorageEventMode?: boolean;
}

export type InitialValue = {
    defaultValue?: string;
}
