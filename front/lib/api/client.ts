const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

type HttpMethod = 'GET' | 'POST';

export async function apiRequest<T>(
  path: string,
  method: HttpMethod,
  body?: unknown
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || `API error ${res.status}`);
  }

  return res.json() as Promise<T>;
}
