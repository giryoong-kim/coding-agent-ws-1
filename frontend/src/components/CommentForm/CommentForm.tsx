import { useState, type FormEvent } from 'react'
import type { Comment } from '../../types'
import { createComment, ApiError } from '../../api/client'
import { ErrorMessage } from '../ErrorMessage/ErrorMessage'
import styles from './CommentForm.module.css'

interface Props {
  issueId: string
  onPosted: (comment: Comment) => void
}

export function CommentForm({ issueId, onPosted }: Props) {
  const [body, setBody] = useState('')
  const [bodyError, setBodyError] = useState('')
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function validateBody(value: string): string {
    if (!value.trim()) return 'Comment body is required.'
    return ''
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setServerError('')

    const err = validateBody(body)
    if (err) {
      setBodyError(err)
      return
    }
    setBodyError('')

    setSubmitting(true)
    try {
      const comment = await createComment(issueId, body.trim())
      setBody('')
      onPosted(comment)
    } catch (err) {
      if (err instanceof ApiError) {
        setServerError(err.message)
      } else {
        setServerError('Failed to post comment. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.form}
      aria-label="Add a comment"
      noValidate
    >
      <div className={styles.field}>
        <label htmlFor="comment-body" className={styles.label}>
          Add Comment
        </label>
        <textarea
          id="comment-body"
          className={`${styles.textarea} ${bodyError ? styles.textareaError : ''}`}
          value={body}
          onChange={(e) => {
            setBody(e.target.value)
            if (bodyError) setBodyError(validateBody(e.target.value))
            setServerError('')
          }}
          placeholder="Write a comment…"
          rows={3}
          disabled={submitting}
          aria-required="true"
          aria-invalid={bodyError ? 'true' : 'false'}
          aria-describedby={bodyError ? 'comment-error' : undefined}
        />
        {bodyError && (
          <span id="comment-error" className={styles.fieldError} role="alert">
            {bodyError}
          </span>
        )}
      </div>

      {serverError && <ErrorMessage message={serverError} />}

      <div className={styles.actions}>
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={submitting || !body.trim()}
          aria-busy={submitting}
        >
          {submitting ? 'Posting…' : 'Post Comment'}
        </button>
      </div>
    </form>
  )
}
