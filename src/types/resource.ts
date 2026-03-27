import type { PackageRecord } from "./package";

export interface ResolvedResource {
    specifier: string;
    packageName: string;
    version: string;
    subpath: string; // '' means package root
    kind: 'module' | 'css' | 'json' | 'asset';
    url: string;
    query: URLSearchParams;
    lockfileEntry?: PackageRecord;
}
