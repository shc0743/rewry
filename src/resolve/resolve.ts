import type { LockfileFile } from "@pnpm/lockfile.types";
import type { PackageRecord } from "@/types/package";
import type { NormalizedRewryOptions } from "@/types/createOptions";
import { ResolveModuleSpecifier } from "./static";
import type { StorageManager } from "@/core/storage-manager";
import { DownloadTarball } from "@/net/download";
import { extractTgzFile } from "@/utils/compress";
import { sequentialRequest } from "@/utils/sequentialRequest";

export async function ResolveModule<T extends { _storage: StorageManager, _config: NormalizedRewryOptions }>(this: T, lockfile: LockfileFile, specifier: string, introducedBy?: string): Promise<PackageRecord> {
    const normalized_specifier = ResolveModuleSpecifier(specifier);
    
    const pkg = (await this._storage.getCachedPackageJson(normalized_specifier.name + '@' + normalized_specifier.version)) ??
        (await extractTgzFile(new Blob([(await sequentialRequest(this._config.registryBases, registry => DownloadTarball(normalized_specifier.name, normalized_specifier.version, registry))).data]), 'package/package.json'));
    
    throw 'stub'
}
