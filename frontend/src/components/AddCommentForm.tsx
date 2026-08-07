import { useState } from 'react'
import { addComment } from '../api/comments'
import { ApiResponseError } from '../api/client'

interface Props {
  issueId: string
  onAdded: () => void
}

export function AddCommentForm({ issueId, onAdded }: Props) {
  const [body, setBody] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const trimmedBody = body.trim()
    if (!trimmedBody) {
      setError('Comment body cannot be empty.')
      return
    }

    setSubmitting(true)
    try {
      await addComment(issueId, trimmedBody)
      setBody('')
      onAdded()
    } catch (err) {
      if (err instanceof ApiResponseError) {
        setError(err.message)
      } else {
        setError('Failed to post comment.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="add-comment-form" onSubmit={handleSubmit} noValidate aria-label="Add comment">
      {error && (
        <div className="form-error" role="alert">
          {error}
        </div>
      )}
      <div className="form-field">
        <label htmlFor="comment-body" className="form-label">
          Comment
        </label>
        <textarea
          id="comment-body"
          className="form-textarea"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Add a comment…"
          rows={3}
          disabled={submitting}
          required
          aria-required="true"
        />
      </div>
      <button
        type="submit"
        className="btn btn-secondary"
        disabled={submitting}
      >
        {submitting ? 'Posting…' : 'Post Comment'}
      </button>
    </form>
  )
}
