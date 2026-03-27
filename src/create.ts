import type { RewryOptions } from './types/createOptions';
import { normalizeOptions } from './core/options';
import { RewryRuntime } from './core/runtime';

export function createRewry(options: RewryOptions): RewryRuntime {
    const normalized = normalizeOptions(options);

    return new RewryRuntime(normalized);
}
