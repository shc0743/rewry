export interface PackageSpecifierInfo { 
    name: string;
    version: string;
    path?: string;
}

export interface PackageRecord {
    name: string;
    version: string;
    main: string;
    exports: unknown;
    integrity: string;
    dependencies: Record<string, string>;
    peerDependencies: Record<string, string>;
    optionalDependencies: Record<string, string>;
}
