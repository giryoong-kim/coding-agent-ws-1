import { useState } from 'react'
import type { Issue } from '../../types'
import { getNextStatuses, statusLabel } from '../../types'
import { updateIssueStatus, ApiError } from '../../api/client'
import { StatusBadge } from '../StatusBadge/StatusBadge'
import { ErrorMessage } from '../ErrorMessage/ErrorMessage'
import styles from './IssueDetail.module.css'

interface Props {
  issue: Issue
  onStatusChanged: (updated: Issue) => void
}

export function IssueDetail({ issue, onStatusChanged }: Props) {
  const [transitioning, setTransitioning] = useState(false)
  const [transitionError, setTransitionError] = useState('')
  const nextStatuses = getNextStatuses(issue.status)

  async function handleTransition(nextStatus: typeof nextStatuses[number]) {
    setTransitionError('')
    setTransitioning(true)
    try {
      const updated = await updateIssueStatus(issue.id, nextStatus)
      onStatusChanged(updated)
    } catch (err) {
      if (err instanceof ApiError) {
        setTransitionError(err.message)
      } else {
        setTransitionError('Failed to update status. Please try again.')
      }
    } finally {
      setTransitioning(false)
    }
  }

  const createdAt = new Date(issue.createdAt)
  const updatedAt = new Date(issue.updatedAt)

  return (
    <article className={styles.article} aria-labelledby="issue-title">
      <div className={styles.titleRow}>
        <h1 id="issue-title" className={styles.title}>
          {issue.title}
        </h1>
        <StatusBadge status={issue.status} />
      </div>

      <div className={styles.meta}>
        <span className={styles.metaItem}>
          <span className={styles.metaLabel}>ID</span>
          <code className={styles.metaValue}>{issue.id}</code>
        </span>
        <span className={styles.metaItem}>
          <span className={styles.metaLabel}>Created</span>
          <time className={styles.metaValue} dateTime={issue.createdAt}>
            {createdAt.toLocaleString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </time>
        </span>
        <span className={styles.metaItem}>
          <span className={styles.metaLabel}>Updated</span>
          <time className={styles.metaValue} dateTime={issue.updatedAt}>
            {updatedAt.toLocaleString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </time>
        </span>
      </div>

      {issue.description && (
        <div className={styles.descSection}>
          <h2 className={styles.descLabel}>Description</h2>
          <p className={styles.desc}>{issue.description}</p>
        </div>
      )}

      <div className={styles.transitionSection}>
        <h2 className={styles.transitionLabel}>
          Status Transition
        </h2>
        {nextStatuses.length > 0 ? (
          <div className={styles.transitionActions}>
            <p className={styles.transitionHint}>
              Current: <strong>{statusLabel(issue.status)}</strong>
              {' → '}Move to:
            </p>
            <div className={styles.transitionButtons}>
              {nextStatuses.map((next) => (
                <button
                  key={next}
                  type="button"
                  className={`${styles.transitionBtn} ${styles[`btn_${next}`]}`}
                  onClick={() => handleTransition(next)}
                  disabled={transitioning}
                  aria-busy={transitioning}
                >
                  {transitioning ? 'Updating…' : statusLabel(next)}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className={styles.noTransition}>
            This issue is <strong>done</strong> — no further transitions available.
          </p>
        )}

        {transitionError && (
          <div className={styles.transitionError}>
            <ErrorMessage message={transitionError} />
          </div>
        )}
      </div>
    </article>
  )
}
