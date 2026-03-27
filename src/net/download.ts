import { valid } from "semver";
import type { StorageManager } from "@/core/storage-manager";
import { GetPackageMetadata } from "./metadata";
import { resolveVersion as resolvePackageVersion } from "@/resolve/version";
import { fetchBinary } from "./request";
import { verifyResourceIntegrity } from "./sri";

export async function DownloadTarball(pkg: string, versionOrTag: string | undefined | null, registry: string, expectIntegrity?: string, useCache?: StorageManager) {
    if (!versionOrTag) versionOrTag = 'latest';
    const isVersion = valid(versionOrTag),
        isExactMatch = (isVersion) && /^(=)??\d+?\.\d+?\.\d+?$/.test(versionOrTag);
    if (useCache && isExactMatch) {
        const cached = await useCache.getDownloadedTarball(pkg + '@' + versionOrTag);
        if (cached) return { version: versionOrTag, data: cached };
    }

    const fullResp = await GetPackageMetadata(pkg, registry);
    const version = resolvePackageVersion(versionOrTag, fullResp);
    
    const { tarball, integrity } = fullResp.versions[version].dist;
    if (!integrity) throw new DOMException('Cannot verify the integrity of the package.', 'SecurityError');
    const data = new Uint8Array(await fetchBinary(tarball));
    await verifyResourceIntegrity(data, integrity);
    if (expectIntegrity) await verifyResourceIntegrity(data, expectIntegrity);

    if (useCache) {
        await useCache.putTarball(pkg + '@' + version, data);
    }

    return {
        version,
        data
    };
}

