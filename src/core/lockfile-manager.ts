import type { LockfileFile, PackageSnapshot, TarballResolution } from '@pnpm/lockfile.types';

export type LockfileImporter = NonNullable<LockfileFile['importers']>[string];

export interface PnpmPackageIdentity {
    name: string;
    version: string;
    key: string;
}

export class PnpmLockfileManager {
    readonly #lockfile: LockfileFile;

    // full package key -> snapshot
    readonly #packagesByKey = new Map<string, PackageSnapshot>();

    // name@version -> full keys (pnpm may have peer variants)
    readonly #keysByNameVersion = new Map<string, string[]>();

    // package name -> versions
    readonly #versionsByName = new Map<string, Set<string>>();

    constructor(lockfile: LockfileFile) {
        this.#lockfile = lockfile;
        this.#buildIndexes();
    }

    get lockfile(): LockfileFile {
        return this.#lockfile;
    }

    hasImporter(importerId = '.'): boolean {
        return !!this.#lockfile.importers?.[importerId];
    }

    getImporter(importerId = '.'): LockfileImporter | undefined {
        return this.#lockfile.importers?.[importerId];
    }

    getImporterDependencyVersion(importerId: string, packageName: string): string | undefined {
        const importer = this.getImporter(importerId);
        if (!importer) return undefined;

        return (
            this.#readDepVersion(importer.dependencies?.[packageName]) ??
            this.#readDepVersion(importer.devDependencies?.[packageName]) ??
            this.#readDepVersion(importer.optionalDependencies?.[packageName])
        );
    }

    getImporterDependencies(importerId = '.'): Record<string, string> {
        const importer = this.getImporter(importerId);
        if (!importer) return {};

        const out: Record<string, string> = {};
        for (const [name, dep] of Object.entries(importer.dependencies ?? {})) {
            const v = this.#readDepVersion(dep);
            if (v) out[name] = v;
        }
        return out;
    }

    getImporterAllDependencies(importerId = '.'): Record<string, string> {
        const importer = this.getImporter(importerId);
        if (!importer) return {};

        const out: Record<string, string> = {};
        for (const source of [importer.dependencies, importer.devDependencies, importer.optionalDependencies]) {
            for (const [name, dep] of Object.entries(source ?? {})) {
                const v = this.#readDepVersion(dep);
                if (v) out[name] = v;
            }
        }
        return out;
    }

    hasPackage(name: string, version: string): boolean {
        return this.getPackageSnapshot(name, version) !== undefined;
    }

    getPackageIdentity(name: string, version: string): PnpmPackageIdentity | undefined {
        const snapshot = this.getPackageSnapshot(name, version);
        if (!snapshot) return undefined;

        const key = this.#resolveBestKey(name, version);
        if (!key) return undefined;

        return { name, version, key };
    }

    getPackageSnapshot(name: string, version: string): PackageSnapshot | undefined {
        const key = this.#resolveBestKey(name, version);
        if (!key) return undefined;
        return this.#packagesByKey.get(key);
    }

    getPackageSnapshotByKey(key: string): PackageSnapshot | undefined {
        return this.#packagesByKey.get(key);
    }

    getPackageIntegrity(name: string, version: string): string | undefined {
        return (this.getPackageSnapshot(name, version)?.resolution as { integrity: string; })?.integrity;
    }

    getPackageTarball(name: string, version: string): string | undefined {
        return (this.getPackageSnapshot(name, version)?.resolution as TarballResolution)?.tarball;
    }

    getPackageDependencies(name: string, version: string): Record<string, string> {
        return this.getPackageSnapshot(name, version)?.dependencies ?? {};
    }

    getPackagePeerDependencies(name: string, version: string): Record<string, string> {
        return this.getPackageSnapshot(name, version)?.peerDependencies ?? {};
    }

    getPackageOptionalDependencies(name: string, version: string): Record<string, string> {
        return this.getPackageSnapshot(name, version)?.optionalDependencies ?? {};
    }

    getPackageVersions(name: string): readonly string[] {
        return [...(this.#versionsByName.get(name) ?? new Set<string>())].sort(this.#compareSemverLike);
    }

    getPackageKeys(name: string, version: string): readonly string[] {
        return [...(this.#keysByNameVersion.get(this.#makeNameVersionKey(name, version)) ?? [])];
    }

    listPackages(): readonly PnpmPackageIdentity[] {
        const out: PnpmPackageIdentity[] = [];
        for (const [key, snapshot] of this.#packagesByKey) {
            const parsed = this.#parsePnpmPackageKey(key);
            if (!parsed) continue;
            out.push({ ...parsed, key });
        }
        return out;
    }

    resolvePackageKey(name: string, version: string): string | undefined {
        return this.#resolveBestKey(name, version);
    }

    getAllKeysForPackage(name: string): readonly string[] {
        const keys: string[] = [];
        for (const [key, snapshot] of this.#packagesByKey) {
            const parsed = this.#parsePnpmPackageKey(key);
            if (!parsed) continue;
            if (parsed.name === name) keys.push(key);
        }
        return keys;
    }

    #buildIndexes(): void {
        const packages = this.#lockfile.packages ?? {};

        for (const [key, snapshot] of Object.entries(packages)) {
            this.#packagesByKey.set(key, snapshot);

            const parsed = this.#parsePnpmPackageKey(key);
            if (!parsed) continue;

            const nameVersionKey = this.#makeNameVersionKey(parsed.name, parsed.version);

            const existing = this.#keysByNameVersion.get(nameVersionKey);
            if (existing) {
                existing.push(key);
            } else {
                this.#keysByNameVersion.set(nameVersionKey, [key]);
            }

            let versions = this.#versionsByName.get(parsed.name);
            if (!versions) {
                versions = new Set<string>();
                this.#versionsByName.set(parsed.name, versions);
            }
            versions.add(parsed.version);
        }

        for (const [k, arr] of this.#keysByNameVersion) {
            arr.sort(this.#comparePackageKey);
        }
    }

    #resolveBestKey(name: string, version: string): string | undefined {
        const keys = this.#keysByNameVersion.get(this.#makeNameVersionKey(name, version));
        if (!keys || keys.length === 0) return undefined;

        if (keys.length === 1) return keys[0];

        return keys[0];
    }

    #makeNameVersionKey(name: string, version: string): string {
        return `${name}@${version}`;
    }

    #readDepVersion(dep: unknown): string | undefined {
        if (!dep) return undefined;
        if (typeof dep === 'string') return dep;
        if (typeof dep === 'object' && dep !== null) {
            const v = (dep as { version?: unknown }).version;
            if (typeof v === 'string') return v;
        }
        return undefined;
    }

    #parsePnpmPackageKey(key: string): PnpmPackageIdentity | undefined {
        // pnpm package keys are usually:
        // "/foo@1.2.3"
        // "/@scope/pkg@1.2.3"
        // "/foo@1.2.3(bar@2.0.0)"
        // "/@scope/pkg@1.2.3(bar@2.0.0)"
        const normalized = key.startsWith('/') ? key.slice(1) : key;

        const peerSuffixStart = normalized.indexOf('(');
        const head = peerSuffixStart >= 0 ? normalized.slice(0, peerSuffixStart) : normalized;

        const at = head.lastIndexOf('@');
        if (at <= 0) return undefined;

        const name = head.slice(0, at);
        const version = head.slice(at + 1);

        if (!name || !version) return undefined;
        return { name, version, key };
    }

    #comparePackageKey = (a: string, b: string): number => {
        if (a.length !== b.length) return a.length - b.length;
        return a.localeCompare(b);
    };

    #compareSemverLike = (a: string, b: string): number => {
        // FIXME: use semver.rcompare
        const pa = this.#splitVersion(a);
        const pb = this.#splitVersion(b);

        for (let i = 0; i < 3; i++) {
            const da = pa[i] ?? 0;
            const db = pb[i] ?? 0;
            if (da !== db) return da - db;
        }

        return a.localeCompare(b);
    };

    #splitVersion(version: string): number[] {
        const core = version.split('-')[0] ?? version;
        return core
            .split('.')
            .map((v) => Number.parseInt(v, 10))
            .filter((n) => Number.isFinite(n));
    }
}

