import { useState } from 'react';
import { api } from '../api/client.js';

/**
 * AddCommentForm — textarea + submit button for adding a comment to an issue.
 *
 * Props:
 *   issueId: string
 *   onCommentAdded: (comment) => void — called after successful creation
 */
export function AddCommentForm({ issueId, onCommentAdded }) {
  const [body, setBody] = useState('');
  const [bodyError, setBodyError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!body.trim()) {
      setBodyError('Comment cannot be empty.');
      return;
    }

    setSubmitting(true);
    setBodyError('');
    setSubmitError('');

    try {
      const comment = await api.addComment(issueId, body.trim());
      setBody('');
      onCommentAdded(comment);
    } catch (err) {
      if (err.status === 422) {
        setBodyError(err.error ?? 'Comment body is invalid.');
      } else if (err.status === 404) {
        setSubmitError(err.error ?? 'Issue not found.');
      } else {
        setSubmitError(err.error ?? 'Failed to post comment. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="add-comment-form">
      <h3 className="add-comment-form-title">Add a Comment</h3>

      {submitError && (
        <div role="alert" className="error-banner" style={{ marginBottom: 'var(--space-3)' }}>
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="comment-body" className="form-label form-label-required">
            Comment
          </label>
          <textarea
            id="comment-body"
            className={`form-textarea${bodyError ? ' error' : ''}`}
            value={body}
            onChange={(e) => {
              setBody(e.target.value);
              if (bodyError) setBodyError('');
            }}
            placeholder="Write a comment…"
            rows={3}
            aria-required="true"
            aria-invalid={bodyError ? 'true' : 'false'}
            aria-describedby={bodyError ? 'comment-body-error' : undefined}
            disabled={submitting}
          />
          {bodyError && (
            <span id="comment-body-error" className="form-error" role="alert">
              {bodyError}
            </span>
          )}
        </div>

        <div className="add-comment-actions">
          <button
            type="submit"
            className="btn btn-primary btn-sm"
            disabled={submitting}
            aria-busy={submitting}
          >
            {submitting ? (
              <>
                <span className="spinner" aria-hidden="true" />
                Posting…
              </>
            ) : (
              'Post Comment'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
