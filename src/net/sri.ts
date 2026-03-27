function parseIntegrity(integrity: string): Array<{ alg: string; hash: string }> {
    return integrity
        .split(/[\s,]+/)
        .map(part => {
            const i = part.indexOf('-');
            if (i <= 0) throw new TypeError(`Invalid integrity token: ${part}`);
            return {
                alg: part.slice(0, i).toLowerCase(),
                hash: part.slice(i + 1),
            };
        });
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
}

const algorithms: Record<string, string> = {
    'sha256': 'SHA-256',
    'sha384': 'SHA-384',
    'sha512': 'SHA-512',
};

export async function verifyResourceIntegrity(
    data: Uint8Array<ArrayBuffer>,
    integrity: string,
): Promise<void> {
    const candidates = parseIntegrity(integrity);

    for (const candidate of candidates) {
        const alg = algorithms[candidate.alg];
        if (!alg) continue;

        const digest = await crypto.subtle.digest(alg, data);
        const expected = base64ToArrayBuffer(candidate.hash);

        if (digest.byteLength === expected.byteLength &&
            new Uint8Array(digest).every((byte, i) => byte === new Uint8Array(expected)[i])) {
            return;
        }
    }

    throw new Error(`Tarball integrity check failed`);
}
