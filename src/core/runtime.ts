import { ImportGraph } from "@/resolve/import-graph";
import type { LoadOptions, NormalizedRewryOptions } from "@/types/createOptions";
import { StorageManager } from "./storage-manager";
import { ResolveModule } from "@/resolve/resolve";

export class RewryRuntime { 
    static get [Symbol.toStringTag]() { return "RewryRuntime"; };

    #options: NormalizedRewryOptions;
    #storage: StorageManager;
    #importGraph: ImportGraph;

    get _storage() { return this.#storage };
    get _config() { return this.#options };

    constructor(options: NormalizedRewryOptions) {
        this.#options = options;
        this.#storage = new StorageManager(options.storageProvider);
        this.#importGraph = new ImportGraph();
    }

    async load(specifier: string, options?: LoadOptions): Promise<unknown> {
        throw new Error('stub')
    }

    async preload(specifier: string, options?: LoadOptions): Promise<void> {
        await this.load(specifier, options);
    }

    resolve = ResolveModule;


}
