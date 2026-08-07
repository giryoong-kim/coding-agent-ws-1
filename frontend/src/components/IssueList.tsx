import { useState, useCallback } from 'react'
import type { Issue, IssueStatus, IssueSummary } from '../types'
import { listIssues } from '../api/issues'
import { getSummary } from '../api/summary'
import { IssueCard } from './IssueCard'
import { SummaryBar } from './SummaryBar'
import { StatusFilter } from './StatusFilter'
import { useAsyncData } from '../hooks/useAsyncData'

interface Props {
  /** Increment to trigger a list + summary refresh after a new issue is created. */
  refreshKey?: number
}

export function IssueList({ refreshKey }: Props) {
  const [statusFilter, setStatusFilter] = useState<IssueStatus | undefined>(undefined)

  const issuesFetcher = useCallback(
    () => listIssues(statusFilter),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [statusFilter, refreshKey],
  )

  const summaryFetcher = useCallback(
    () => getSummary(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [refreshKey],
  )

  const { data: issues, loading: issuesLoading, error: issuesError } = useAsyncData<Issue[]>(issuesFetcher)
  const { data: summary, loading: summaryLoading, error: summaryError } = useAsyncData<IssueSummary>(summaryFetcher)

  return (
    <section className="issue-list-section">
      <div className="issue-list-toolbar">
        <StatusFilter value={statusFilter} onChange={setStatusFilter} />
      </div>

      {summaryLoading && !summary && (
        <div className="state-loading" role="status" aria-live="polite">
          Loading summary…
        </div>
      )}
      {summaryError && (
        <div className="state-error" role="alert">
          <strong>Failed to load summary</strong>
          <p>{summaryError.message}</p>
        </div>
      )}
      {summary && <SummaryBar summary={summary} />}

      {issuesLoading && (
        <div className="state-loading" role="status" aria-live="polite">
          Loading issues…
        </div>
      )}

      {issuesError && (
        <div className="state-error" role="alert">
          <strong>Failed to load issues</strong>
          <p>{issuesError.message}</p>
        </div>
      )}

      {issues && !issuesLoading && (
        <>
          {issues.length === 0 ? (
            <div className="state-empty">
              {statusFilter
                ? `No issues with status "${statusFilter}".`
                : 'No issues yet. Create one using the form.'}
            </div>
          ) : (
            <ul className="issue-list" aria-label="Issues">
              {issues.map((issue) => (
                <li key={issue.id}>
                  <IssueCard issue={issue} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  )
}
