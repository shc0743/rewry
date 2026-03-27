export const sfetch = (input: RequestInfo | URL, init?: RequestInit) => fetch(input, init).then(resp => {
    if (!resp.ok) throw new TypeError(`Fetch: remote error: HTTP ${resp.status} ${resp.statusText}`);
    return resp;
});

export const fetchText = (input: RequestInfo | URL, init?: RequestInit) => sfetch(input, init).then(resp => resp.text());
export const fetchJson = (input: RequestInfo | URL, init?: RequestInit) => sfetch(input, init).then(resp => resp.json());
export const fetchBlob = (input: RequestInfo | URL, init?: RequestInit) => sfetch(input, init).then(resp => resp.blob());
export const fetchBinary = (input: RequestInfo | URL, init?: RequestInit) => sfetch(input, init).then(resp => resp.arrayBuffer());
