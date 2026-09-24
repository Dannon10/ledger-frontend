const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ApiOptions = {
    method?: string;
    body?: unknown;
};

export async function api(path: string, options: ApiOptions = {}) {
    const res = await fetch(`${API_URL}${path}`, {
        method: options.method || 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: options.body ? JSON.stringify(options.body) : undefined,
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
    }

    return data;
}