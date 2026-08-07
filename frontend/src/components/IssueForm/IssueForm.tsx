import { useState, type FormEvent } from 'react'
import { createIssue, ApiError } from '../../api/client'
import type { Issue } from '../../types'
import { ErrorMessage } from '../ErrorMessage/ErrorMessage'
import styles from './IssueForm.module.css'

interface Props {
  /** Called with the newly created issue when submission succeeds */
  onCreated: (issue: Issue) => void
}

export function IssueForm({ onCreated }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [titleError, setTitleError] = useState('')
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  function validateTitle(value: string): string {
    if (!value.trim()) return 'Title is required.'
    if (value.trim().length > 500) return 'Title must be 500 characters or fewer.'
    return ''
  }

  function handleTitleChange(value: string) {
    setTitle(value)
    if (titleError) setTitleError(validateTitle(value))
    setSuccess(false)
    setServerError('')
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setServerError('')
    setSuccess(false)

    const err = validateTitle(title)
    if (err) {
      setTitleError(err)
      return
    }
    setTitleError('')

    setSubmitting(true)
    try {
      const issue = await createIssue(title.trim(), description.trim())
      setTitle('')
      setDescription('')
      setSuccess(true)
      onCreated(issue)
    } catch (err) {
      if (err instanceof ApiError) {
        setServerError(err.message)
      } else {
        setServerError('An unexpected error occurred. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className={styles.section} aria-labelledby="create-issue-heading">
      <h2 id="create-issue-heading" className={styles.heading}>
        New Issue
      </h2>

      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <div className={styles.field}>
          <label htmlFor="issue-title" className={styles.label}>
            Title <span className={styles.required} aria-hidden="true">*</span>
          </label>
          <input
            id="issue-title"
            type="text"
            className={`${styles.input} ${titleError ? styles.inputError : ''}`}
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Short summary of the issue"
            maxLength={500}
            aria-required="true"
            aria-invalid={titleError ? 'true' : 'false'}
            aria-describedby={titleError ? 'title-error' : undefined}
            disabled={submitting}
            autoComplete="off"
          />
          {titleError && (
            <span id="title-error" className={styles.fieldError} role="alert">
              {titleError}
            </span>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="issue-description" className={styles.label}>
            Description
          </label>
          <textarea
            id="issue-description"
            className={styles.textarea}
            value={description}
            onChange={(e) => { setDescription(e.target.value); setSuccess(false) }}
            placeholder="Detailed description of the issue (optional)"
            rows={4}
            disabled={submitting}
          />
        </div>

        {serverError && (
          <ErrorMessage message={serverError} />
        )}

        {success && (
          <p className={styles.successMsg} role="status" aria-live="polite">
            Issue created successfully.
          </p>
        )}

        <div className={styles.actions}>
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={submitting}
            aria-busy={submitting}
          >
            {submitting ? 'Creating…' : 'Create Issue'}
          </button>
        </div>
      </form>
    </section>
  )
}
