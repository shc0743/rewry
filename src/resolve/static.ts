// static resolve: parse from specifier
import { parse } from 'parse-package-name'
import type { PackageSpecifierInfo } from "@/types/package";

export function ResolveModuleSpecifier(specifier: string): PackageSpecifierInfo {
    return parse(specifier);
}
