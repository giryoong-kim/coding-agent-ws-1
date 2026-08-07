import { useState, useEffect } from 'react';
import { api } from '../api/client.js';
import { StatusBadge } from './StatusBadge.jsx';
import { StatusChangeControl } from './StatusChangeControl.jsx';
import { CommentThread } from './CommentThread.jsx';

/**
 * IssueDetail — full view of a single issue with status control and comments.
 *
 * Props:
 *   issueId: string
 *   onBack: () => void
 *   onIssueChanged: (updatedIssue) => void — called when status changes (to refresh summary)
 */
export function IssueDetail({ issueId, onBack, onIssueChanged }) {
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    api
      .getIssue(issueId)
      .then((data) => {
        if (!cancelled) {
          setIssue(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err.status === 404
              ? 'Issue not found.'
              : (err.error ?? 'Failed to load issue')
          );
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [issueId]);

  function handleStatusChanged(updatedIssue) {
    setIssue(updatedIssue);
    onIssueChanged(updatedIssue);
  }

  function formatDate(iso) {
    return new Date(iso).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--color-text-muted)' }}>
        <div className="spinner" style={{ margin: '0 auto var(--space-4)' }} aria-hidden="true" />
        <p>Loading issue…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="issue-detail-back">
          <button type="button" className="btn btn-ghost" onClick={onBack}>
            ← Back to issues
          </button>
        </div>
        <div className="error-banner mt-4" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <article className="issue-detail">
      {/* Back navigation */}
      <div className="issue-detail-back">
        <button type="button" className="btn btn-ghost" onClick={onBack} aria-label="Back to issue list">
          ← Back to issues
        </button>
      </div>

      {/* Issue header */}
      <div className="card issue-detail-header">
        <h1 className="issue-detail-title">{issue.title}</h1>

        <div className="issue-detail-meta">
          <StatusBadge status={issue.status} />
          <span className="issue-detail-meta-item">
            <span className="issue-detail-meta-label">ID</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>
              {issue.id.slice(0, 12)}
            </span>
          </span>
          <span className="issue-detail-meta-item">
            <span className="issue-detail-meta-label">Created</span>
            <time dateTime={issue.createdAt}>{formatDate(issue.createdAt)}</time>
          </span>
          {issue.updatedAt !== issue.createdAt && (
            <span className="issue-detail-meta-item">
              <span className="issue-detail-meta-label">Updated</span>
              <time dateTime={issue.updatedAt}>{formatDate(issue.updatedAt)}</time>
            </span>
          )}
        </div>

        {issue.description ? (
          <p className="issue-detail-description">{issue.description}</p>
        ) : (
          <p className="issue-detail-description text-muted" style={{ fontStyle: 'italic' }}>
            No description provided.
          </p>
        )}
      </div>

      {/* Status change */}
      <StatusChangeControl issue={issue} onStatusChanged={handleStatusChanged} />

      {/* Comments */}
      <CommentThread issueId={issue.id} />
    </article>
  );
}
