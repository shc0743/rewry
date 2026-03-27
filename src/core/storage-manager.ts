import type { StorageProvider } from "@/types/storageProvider";

export class StorageManager {
    readonly #_StorImpl: StorageProvider;

    constructor(provider: StorageProvider) {
        this.#_StorImpl = provider;
    }

    async get(key: string): Promise<Uint8Array<ArrayBuffer> | undefined> {
        return await this.#_StorImpl.get(key);
    }

    async set(
        key: string,
        data: Uint8Array<ArrayBuffer>
    ): Promise<void> {
        return await this.#_StorImpl.set(key, data);
    }

    async getObject(
        request: RequestInfo | URL
    ): Promise<Response | undefined> {
        return await this.#_StorImpl.getObject(request);
    }

    async listObject(
        request: RequestInfo | URL,
        options?: CacheQueryOptions
    ): Promise<readonly Request[]> {
        return await this.#_StorImpl.listObject(request, options);
    }

    async putObject(
        request: RequestInfo | URL,
        object: Response
    ): Promise<void> {
        return await this.#_StorImpl.putObject(request, object);
    }

    async deleteObject(
        request: RequestInfo | URL
    ): Promise<boolean> {
        return await this.#_StorImpl.deleteObject(request);
    }

    async clearObject(): Promise<boolean> {
        return await this.#_StorImpl.clearObject();
    }

    // ------

    getDownloadedTarball(specifier: string) {
        return this.get('tarball:' + specifier);
    }

    getCachedPackageJson(specifier: string) {
        return this.get('pkg:' + specifier);
    }

    putTarball(specifier: string, data: Uint8Array<ArrayBuffer>) {
        return this.set('tarball:' + specifier, data);
    }
}
