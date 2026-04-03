import type { RewryOptions } from './types/createOptions';
import { normalizeOptions } from './core/options';
import { RewryRuntime } from './core/runtime';

export function createRewry(options: RewryOptions): RewryRuntime {
    const normalized = normalizeOptions(options);
    throw 'This package is a stub and is not finished, please do not install';

    return new RewryRuntime(normalized);
}
