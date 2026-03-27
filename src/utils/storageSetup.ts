import type { IDBPDatabase } from 'idb';
import type { StorageProvider } from "@/types/storageProvider";

export function createStorageProviderOnCacheStorageAndIndexedDB(
    cacheName: string,
    idb: IDBPDatabase,
    objectStoreName: string,
): StorageProvider {
    return {
        get: k => idb.get(objectStoreName, k),
        set: (k, d) => idb.put(objectStoreName, d, k).then(),
        getObject: req => caches.open(cacheName).then(cache => cache.match(req)),
        putObject: (req, resp) => caches.open(cacheName).then(cache => cache.put(req, resp)),
        listObject: (req, opt) => caches.open(cacheName).then(cache => cache.keys(req, opt)),
        deleteObject: req => caches.open(cacheName).then(cache => cache.delete(req)),
        clearObject: () => caches.delete(cacheName),
    };
}

