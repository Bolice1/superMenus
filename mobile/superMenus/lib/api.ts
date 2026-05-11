import { API_BASE } from '@/lib/config';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function api<T>(
  path: string,
  init?: RequestInit & { token?: string | null },
): Promise<T> {
  const { token, ...rest } = init ?? {};
  const headers = new Headers(rest.headers);
  if (rest.body && typeof rest.body === 'string' && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(`${API_BASE}${path.startsWith('/') ? path : `/${path}`}`, {
    ...rest,
    headers,
  });

  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { msg: text };
    }
  }

  if (!res.ok) {
    const msg =
      typeof data === 'object' && data !== null && 'msg' in data
        ? String((data as { msg: string }).msg)
        : res.statusText;
    throw new ApiError(msg || 'Request failed', res.status);
  }

  return data as T;
}
