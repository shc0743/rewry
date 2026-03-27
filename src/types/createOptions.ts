import type { LockfileFile } from "@pnpm/lockfile.types";
import type { StorageProvider } from "./storageProvider";

export type LockfileInput = LockfileFile;

export type LoadWithType = 'javascript' | 'css' | 'json' | 'text' | 'url';

export interface LoadOptions {
    with?: {
        type?: LoadWithType;
    };
    inline?: boolean;
}

export interface RewryOptions {
    lockfile: LockfileInput;
    registryBases?: string[];
    prefix: string;
    storageProvider: StorageProvider;
}

export interface NormalizedRewryOptions {
    lockfile: LockfileFile;
    registryBases: string[];
    prefix: string;
    storageProvider: StorageProvider;
}
