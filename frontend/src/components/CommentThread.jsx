import { useState, useEffect } from 'react';
import { api } from '../api/client.js';
import { AddCommentForm } from './AddCommentForm.jsx';

/**
 * CommentThread — fetches and displays comments for an issue, with an inline add-comment form.
 *
 * Props:
 *   issueId: string
 */
export function CommentThread({ issueId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    api
      .getComments(issueId)
      .then((data) => {
        if (!cancelled) {
          setComments(data.comments ?? []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.error ?? 'Failed to load comments');
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [issueId]);

  function handleCommentAdded(newComment) {
    setComments((prev) => [...prev, newComment]);
  }

  return (
    <section className="card comment-section" aria-label="Comments">
      <h2 className="comment-section-title">
        Comments
        {!loading && !error && (
          <span style={{ fontWeight: 400, color: 'var(--color-text-muted)', marginLeft: 'var(--space-2)' }}>
            ({comments.length})
          </span>
        )}
      </h2>

      {loading && (
        <p role="status" style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
          <span className="spinner" aria-hidden="true" style={{ marginRight: 'var(--space-2)' }} />
          Loading comments…
        </p>
      )}

      {error && !loading && (
        <div role="alert" className="error-banner" style={{ marginBottom: 'var(--space-4)' }}>
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {comments.length === 0 ? (
            <p className="comment-empty">No comments yet. Be the first to comment.</p>
          ) : (
            <ul className="comment-list" role="list" aria-label="Comment list">
              {comments.map((comment) => {
                const createdAt = new Date(comment.createdAt).toLocaleString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <li key={comment.id} className="comment-item">
                    <div className="comment-meta">
                      <span className="comment-id">#{comment.id.slice(0, 8)}</span>
                      <time className="comment-date" dateTime={comment.createdAt}>
                        {createdAt}
                      </time>
                    </div>
                    <div className="comment-body">{comment.body}</div>
                  </li>
                );
              })}
            </ul>
          )}

          <AddCommentForm issueId={issueId} onCommentAdded={handleCommentAdded} />
        </>
      )}
    </section>
  );
}
