export interface SynchronousStorageProvider {
    get: (key: string) => Uint8Array<ArrayBuffer> | undefined;
    set: (key: string, data: Uint8Array<ArrayBuffer>) => void;
    getObject: (request: RequestInfo | URL) => Response | undefined;
    listObject: (request: RequestInfo | URL, options?: CacheQueryOptions) => readonly Request[];
    putObject: (request: RequestInfo | URL, object: Response) => void;
    deleteObject: (request: RequestInfo | URL) => boolean;
    clearObject: () => boolean;
}
export interface AsynchronousStorageProvider {
    get: (key: string) => Promise<Uint8Array<ArrayBuffer> | undefined>;
    set: (key: string, data: Uint8Array<ArrayBuffer>) => Promise<void>;
    getObject: (request: RequestInfo | URL) => Promise<Response | undefined>;
    listObject: (request: RequestInfo | URL, options?: CacheQueryOptions) => Promise<readonly Request[]>;
    putObject: (request: RequestInfo | URL, object: Response) => Promise<void>;
    deleteObject: (request: RequestInfo | URL) => Promise<boolean>;
    clearObject: () => Promise<boolean>;
}

export type StorageProvider = SynchronousStorageProvider | AsynchronousStorageProvider;

