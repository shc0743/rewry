import { valid, validRange, maxSatisfying } from 'semver';

export function resolveVersion(input: string, meta: any): string {
    const spec = input;

    const exact = valid(spec);
    if (exact) return exact;

    const tag = meta['dist-tags']?.[spec];
    if (tag && valid(tag)) return tag;

    const range = validRange(spec);
    if (range) {
        const picked = maxSatisfying(Object.keys(meta.versions ?? {}), range);
        if (picked) return picked;
    }

    throw new TypeError(`${input} is not a valid version specifier`);
}
