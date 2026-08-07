import { useState } from 'react';
import { api } from '../api/client.js';

/**
 * CreateIssueModal — modal form to create a new issue.
 *
 * Props:
 *   onClose: () => void
 *   onCreated: (issue) => void  — called after successful creation
 */
export function CreateIssueModal({ onClose, onCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [titleError, setTitleError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    if (!title.trim()) {
      setTitleError('Title is required.');
      return false;
    }
    setTitleError('');
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setSubmitError('');
    setTitleError('');

    try {
      const issue = await api.createIssue(title.trim(), description.trim());
      onCreated(issue);
    } catch (err) {
      // Surface backend validation errors inline
      if (err.status === 422) {
        setTitleError(err.error ?? 'Invalid input.');
      } else {
        setSubmitError(err.error ?? 'Failed to create issue. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      onClose();
    }
  }

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-modal-title"
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
    >
      <div className="modal">
        <div className="modal-header">
          <h2 id="create-modal-title" className="modal-title">
            Create New Issue
          </h2>
          <button
            type="button"
            className="modal-close"
            aria-label="Close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            {submitError && (
              <div role="alert" className="error-banner">
                {submitError}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="create-title" className="form-label form-label-required">
                Title
              </label>
              <input
                id="create-title"
                type="text"
                className={`form-input${titleError ? ' error' : ''}`}
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (titleError) setTitleError('');
                }}
                placeholder="Short, descriptive title"
                aria-required="true"
                aria-invalid={titleError ? 'true' : 'false'}
                aria-describedby={titleError ? 'create-title-error' : undefined}
                autoFocus
                disabled={submitting}
              />
              {titleError && (
                <span id="create-title-error" className="form-error" role="alert">
                  {titleError}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="create-description" className="form-label">
                Description
              </label>
              <textarea
                id="create-description"
                className="form-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional — describe the issue in detail"
                rows={4}
                disabled={submitting}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="spinner" aria-hidden="true" />
                  Creating…
                </>
              ) : (
                'Create Issue'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
