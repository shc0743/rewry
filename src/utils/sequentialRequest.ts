export async function sequentialRequest<T, ListType>(
    list: readonly ListType[],
    fn: (item: ListType) => T | Promise<T>
): Promise<T>;

export async function sequentialRequest<T, ListType>(
    list: readonly ListType[],
    fn: (item: ListType, index: number) => T | Promise<T>
): Promise<T>;

export async function sequentialRequest<T, ListType>(
    list: readonly ListType[],
    fn: (item: ListType, index: number) => T | Promise<T>
): Promise<T> {
    let lastError: unknown;

    let i = 0;
    for (const item of list) {
        try {
            return await fn(item, i++);
        } catch (err) {
            lastError = err;
        }
    }

    throw lastError;
}

