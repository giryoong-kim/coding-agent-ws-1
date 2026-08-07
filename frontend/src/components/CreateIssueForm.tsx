import { useState } from 'react'
import { createIssue } from '../api/issues'
import { ApiResponseError } from '../api/client'

interface Props {
  onCreated: () => void
}

export function CreateIssueForm({ onCreated }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    // Client-side non-empty validation before hitting the server
    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      setError('Title is required.')
      return
    }

    setSubmitting(true)
    try {
      await createIssue(trimmedTitle, description.trim())
      setTitle('')
      setDescription('')
      onCreated()
    } catch (err) {
      if (err instanceof ApiResponseError) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="create-issue-form" onSubmit={handleSubmit} noValidate aria-label="Create new issue">
      <h2 className="form-title">New Issue</h2>

      {error && (
        <div className="form-error" role="alert">
          {error}
        </div>
      )}

      <div className="form-field">
        <label htmlFor="issue-title" className="form-label">
          Title <span aria-hidden="true">*</span>
        </label>
        <input
          id="issue-title"
          type="text"
          className="form-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Short, descriptive title"
          required
          aria-required="true"
          disabled={submitting}
          maxLength={250}
        />
      </div>

      <div className="form-field">
        <label htmlFor="issue-description" className="form-label">
          Description
        </label>
        <textarea
          id="issue-description"
          className="form-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What is the issue? Provide context, steps to reproduce, expected vs actual behaviour…"
          rows={4}
          disabled={submitting}
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={submitting}
      >
        {submitting ? 'Creating…' : 'Create Issue'}
      </button>
    </form>
  )
}
