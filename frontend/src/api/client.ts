/**
 * API base-URL resolution — browser-fact aware.
 *
 * Priority order (first truthy value wins):
 *  1. ?endpoint=<url> query param   — explicit per-request override
 *  2. window.__API_BASE_URL__       — host-page injection
 *  3. __API_BASE_URL__ build const  — VITE_API_BASE_URL at build time
 *  4. ''                            — same-origin (default, no config needed)
 *
 * The resolved value is always an origin string like "https://example.com"
 * or "" (which means "same origin as the page").
 */

declare const __API_BASE_URL__: string

function resolveApiBase(): string {
  // 1. ?endpoint= query parameter
  try {
    const params = new URLSearchParams(window.location.search)
    const ep = params.get('endpoint')
    if (ep) return ep.replace(/\/$/, '')
  } catch {
    // not in browser context (e.g. SSR / test) — fall through
  }

  // 2. Host-page injection via window global
  if (
    typeof window !== 'undefined' &&
    '__API_BASE_URL__' in window &&
    typeof (window as { __API_BASE_URL__?: string }).__API_BASE_URL__ === 'string' &&
    (window as { __API_BASE_URL__?: string }).__API_BASE_URL__
  ) {
    return ((window as { __API_BASE_URL__?: string }).__API_BASE_URL__ as string).replace(/\/$/, '')
  }

  // 3. Build-time constant (VITE_API_BASE_URL env var, injected by vite.config.ts)
  if (typeof __API_BASE_URL__ !== 'undefined' && __API_BASE_URL__) {
    return __API_BASE_URL__.replace(/\/$/, '')
  }

  // 4. Same-origin default — no configuration needed when one process serves
  //    both the page and the API.
  return ''
}

export const API_BASE = resolveApiBase()

/** The full API prefix shown in the UI and used for all requests. */
export const API_PREFIX = `${API_BASE}/api/v1`

// ─── Generic fetch wrapper ────────────────────────────────────────────────────

export class ApiResponseError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: string,
    public readonly parsed: { error?: string } | null,
  ) {
    super(parsed?.error ?? `HTTP ${status}`)
    this.name = 'ApiResponseError'
  }
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const url = `${API_PREFIX}${path}`
  const response = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const text = await response.text()
  let json: unknown
  try {
    json = JSON.parse(text)
  } catch {
    json = null
  }

  if (!response.ok) {
    throw new ApiResponseError(
      response.status,
      text,
      json as { error?: string } | null,
    )
  }

  return json as T
}

export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body: unknown) => request<T>('POST', path, body),
  patch: <T>(path: string, body: unknown) => request<T>('PATCH', path, body),
}
