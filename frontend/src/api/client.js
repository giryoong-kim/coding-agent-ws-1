/**
 * API client for the Issue Tracker backend.
 *
 * Backend URL is resolved at runtime (never hardcoded):
 *   1. ?endpoint=<url> query parameter  — explicit per-request override
 *   2. window.BACKEND_ORIGIN            — injected by the host page or server
 *   3. window.location.origin           — same-origin default (backend serves this page)
 *
 * All fetch calls go through this module. Import `api` for data operations
 * and `resolveBackendOrigin` to display the resolved address in the UI.
 */

/**
 * Returns the backend origin, resolved in priority order.
 * Strips any trailing slash for uniform concatenation.
 */
export function resolveBackendOrigin() {
  const params = new URLSearchParams(window.location.search);
  const queryEndpoint = params.get('endpoint');
  if (queryEndpoint && queryEndpoint.trim()) {
    return queryEndpoint.trim().replace(/\/$/, '');
  }
  if (typeof window.BACKEND_ORIGIN === 'string' && window.BACKEND_ORIGIN.trim()) {
    return window.BACKEND_ORIGIN.trim().replace(/\/$/, '');
  }
  return window.location.origin;
}

function apiBase() {
  return resolveBackendOrigin() + '/api/v1';
}

/**
 * Core fetch wrapper.
 * On non-2xx: throws { status, error, data } so callers can inspect the HTTP status.
 * Handles non-JSON bodies gracefully.
 */
async function request(method, path, body) {
  const url = apiBase() + path;
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  };
  if (body !== undefined) {
    opts.body = JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(url, opts);
  } catch (networkErr) {
    throw {
      status: 0,
      error: `Network error reaching ${url}: ${networkErr.message}`,
      data: null,
    };
  }

  let data;
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    data = await res.json().catch(() => ({ error: 'Invalid JSON in response' }));
  } else {
    const text = await res.text().catch(() => '');
    data = { error: text || `HTTP ${res.status}` };
  }

  if (!res.ok) {
    throw {
      status: res.status,
      error: (data && data.error) ? data.error : `HTTP ${res.status}`,
      data,
    };
  }

  return data;
}

/** All API operations. Every call returns the parsed JSON from the backend. */
export const api = {
  /**
   * Create a new issue.
   * POST /api/v1/issues
   * Body: { title, description }
   * Returns: Issue (201)
   * Throws { status: 422, error } when title is empty.
   */
  createIssue(title, description) {
    return request('POST', '/issues', { title, description });
  },

  /**
   * List issues, optionally filtered by status.
   * GET /api/v1/issues[?status=open|in_progress|done]
   * Returns: { issues: Issue[] }
   * Throws { status: 422, error } when status value is invalid.
   */
  getIssues(status) {
    const qs =
      status && status !== 'all' ? `?status=${encodeURIComponent(status)}` : '';
    return request('GET', `/issues${qs}`);
  },

  /**
   * Get a single issue by ID.
   * GET /api/v1/issues/:id
   * Returns: Issue
   * Throws { status: 404, error } when not found.
   */
  getIssue(id) {
    return request('GET', `/issues/${encodeURIComponent(id)}`);
  },

  /**
   * Transition an issue to a new status.
   * PATCH /api/v1/issues/:id/status
   * Body: { status }
   * Returns: Issue (200)
   * Throws { status: 409, error } on illegal transition.
   * Throws { status: 422, error } on invalid status value.
   */
  updateIssueStatus(id, status) {
    return request('PATCH', `/issues/${encodeURIComponent(id)}/status`, { status });
  },

  /**
   * Add a comment to an issue.
   * POST /api/v1/issues/:id/comments
   * Body: { body }
   * Returns: Comment (201)
   * Throws { status: 404, error } when issue not found.
   * Throws { status: 422, error } when body is empty.
   */
  addComment(issueId, body) {
    return request('POST', `/issues/${encodeURIComponent(issueId)}/comments`, { body });
  },

  /**
   * Fetch comments for an issue.
   * GET /api/v1/issues/:id/comments
   * Returns: { comments: Comment[] }
   * Throws { status: 404, error } when issue not found.
   */
  getComments(issueId) {
    return request('GET', `/issues/${encodeURIComponent(issueId)}/comments`);
  },

  /**
   * Fetch per-status issue counts.
   * GET /api/v1/summary
   * Returns: { open: number, in_progress: number, done: number }
   */
  getSummary() {
    return request('GET', '/summary');
  },
};
