import { fetchJson } from "./request";

export function normalizePackageNameForRegistry(name: string): string {
    return encodeURIComponent(name);
}

export async function GetPackageMetadata(packageName: string, registry: string) {
    return await fetchJson(new URL(normalizePackageNameForRegistry(packageName), registry));
}

export async function GetPackageVersionMetadata(packageName: string, version: string, registry: string) {
    return await fetchJson(new URL(normalizePackageNameForRegistry(packageName) + '/' + version, registry));
}
