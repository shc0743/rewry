import {
    createGzipDecoder,
    unpackTar,
} from "modern-tar";

export async function extractTgz(
    tgz: Blob
) {
    const stream = tgz
        .stream()
        .pipeThrough(createGzipDecoder());

    const entries = await unpackTar(stream);

    const result = new Map<string, Uint8Array<ArrayBuffer>>();

    for (const entry of entries) {
        // entry.header.name
        // entry.data (Uint8Array)
        if (entry.header.type === "file" && entry.data) {
            result.set(entry.header.name, entry.data as Uint8Array<ArrayBuffer>);
        }
    }

    return result;
}

export async function extractTgzFile(
    tgz: Blob,
    filename: string
): Promise<Uint8Array<ArrayBuffer> | undefined> {
    const stream = tgz
        .stream()
        .pipeThrough(createGzipDecoder());

    const entries = await unpackTar(stream);
    return entries.find(e => e.header.type === 'file' && e.header.name === filename)?.data as Uint8Array<ArrayBuffer> | undefined;
}

