import { useState } from 'react'
import type { IssueStatus } from '../types'
import { STATUS_LABELS, nextStatus } from '../types'
import { transitionStatus } from '../api/issues'
import { ApiResponseError } from '../api/client'

interface Props {
  issueId: string
  currentStatus: IssueStatus
  onTransitioned: () => void
}

export function StatusControl({ issueId, currentStatus, onTransitioned }: Props) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const target = nextStatus(currentStatus)

  if (!target) {
    return (
      <div className="status-control">
        <span className="status-control-done" aria-label="Issue is done; no further transitions available.">
          Issue is complete.
        </span>
      </div>
    )
  }

  async function handleTransition() {
    setError(null)
    setSubmitting(true)
    try {
      await transitionStatus(issueId, target!)
      onTransitioned()
    } catch (err) {
      if (err instanceof ApiResponseError) {
        setError(err.message)
      } else {
        setError('Transition failed.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="status-control">
      <button
        type="button"
        className="btn btn-transition"
        onClick={handleTransition}
        disabled={submitting}
        aria-label={`Advance status to ${STATUS_LABELS[target]}`}
      >
        {submitting ? 'Updating…' : `Move to ${STATUS_LABELS[target]}`}
      </button>
      {error && (
        <span className="status-control-error" role="alert">
          {error}
        </span>
      )}
    </div>
  )
}
