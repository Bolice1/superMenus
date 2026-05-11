const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:4000/api').replace(/\/$/, '')

export class ApiError extends Error {
  status: number
  body: unknown
  constructor(message: string, status: number, body: unknown) {
    super(message)
    this.status = status
    this.body = body
  }
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const token = localStorage.getItem('sm_token')
  const headers = new Headers(init?.headers)
  const isJsonBody =
    init?.body != null &&
    !(init.body instanceof FormData) &&
    typeof init.body === 'string'
  if (isJsonBody && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const res = await fetch(`${API_BASE}${path.startsWith('/') ? path : `/${path}`}`, {
    ...init,
    headers,
  })

  let data: unknown = null
  const text = await res.text()
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = { msg: text }
    }
  }

  if (!res.ok) {
    const msg =
      typeof data === 'object' && data && 'msg' in data
        ? String((data as { msg: string }).msg)
        : res.statusText
    throw new ApiError(msg || 'Request failed', res.status, data)
  }

  return data as T
}

export function getApiBase(): string {
  return API_BASE
}
