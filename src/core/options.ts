import { DEFAULT_CONDITIONS, DEFAULT_PREFIX, DEFAULT_REGISTRY_BASES } from '@/constants';
import type { NormalizedRewryOptions, RewryOptions } from '@/types/createOptions';

export function normalizeOptions(options: RewryOptions): NormalizedRewryOptions {
    return {
        lockfile: (options.lockfile),
        registryBases: options.registryBases?.length ? [...options.registryBases] : [...DEFAULT_REGISTRY_BASES],
        prefix: normalizePrefix(options.prefix ?? DEFAULT_PREFIX),
        storageProvider: options.storageProvider,
    };
}

function normalizePrefix(prefix: string): string {
    return prefix.endsWith('/') ? prefix : `${prefix}/`;
}
