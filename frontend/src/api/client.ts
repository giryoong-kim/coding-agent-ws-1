/**
 * API client for the Issue Tracker backend.
 *
 * Address resolution (first match wins):
 *   1. ?endpoint= query parameter (explicit override)
 *   2. window.__API_ORIGIN__ injected by the hosting page
 *   3. window.location.origin — same-origin default (works with no config
 *      when the backend serves this page)
 *
 * All API calls use the prefix /api/v1 on the resolved origin.
 */

import type {
  Issue,
  IssueStatus,
  IssueListResponse,
  Comment,
  CommentListResponse,
} from '../types'

declare global {
  interface Window {
    __API_ORIGIN__?: string
  }
}

function resolveApiOrigin(): string {
  // 1. Explicit query-parameter override
  const params = new URLSearchParams(window.location.search)
  const param = params.get('endpoint')
  if (param) return param.replace(/\/$/, '')

  // 2. Value injected by the host page (meta tag, script, etc.)
  if (window.__API_ORIGIN__) return window.__API_ORIGIN__.replace(/\/$/, '')

  // 3. Same-origin: the page is served by the same process that answers /api
  return window.location.origin
}

export const API_ORIGIN = resolveApiOrigin()
const BASE = `${API_ORIGIN}/api/v1`

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

async function request<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const url = `${BASE}${path}`
  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })

  if (!res.ok) {
    let message = `HTTP ${res.status}`
    try {
      const body = await res.json() as { error?: string }
      if (body.error) message = body.error
    } catch {
      // ignore parse errors; keep the HTTP status message
    }
    throw new ApiError(message, res.status)
  }

  return res.json() as Promise<T>
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// ---------------------------------------------------------------------------
// Issues
// ---------------------------------------------------------------------------

export async function createIssue(
  title: string,
  description: string,
): Promise<Issue> {
  return request<Issue>('/issues', {
    method: 'POST',
    body: JSON.stringify({ title, description }),
  })
}

export async function listIssues(
  status?: IssueStatus | '',
): Promise<IssueListResponse> {
  const qs = status ? `?status=${encodeURIComponent(status)}` : ''
  return request<IssueListResponse>(`/issues${qs}`)
}

export async function getIssue(id: string): Promise<Issue> {
  return request<Issue>(`/issues/${encodeURIComponent(id)}`)
}

export async function updateIssueStatus(
  id: string,
  status: IssueStatus,
): Promise<Issue> {
  return request<Issue>(`/issues/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

// ---------------------------------------------------------------------------
// Comments
// ---------------------------------------------------------------------------

export async function listComments(issueId: string): Promise<CommentListResponse> {
  return request<CommentListResponse>(
    `/issues/${encodeURIComponent(issueId)}/comments`,
  )
}

export async function createComment(
  issueId: string,
  body: string,
): Promise<Comment> {
  return request<Comment>(
    `/issues/${encodeURIComponent(issueId)}/comments`,
    {
      method: 'POST',
      body: JSON.stringify({ body }),
    },
  )
}
