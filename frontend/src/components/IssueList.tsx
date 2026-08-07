import { useState, useCallback } from 'react'
import type { IssueListResponse, IssueStatus } from '../types'
import { listIssues } from '../api/issues'
import { IssueCard } from './IssueCard'
import { SummaryBar } from './SummaryBar'
import { StatusFilter } from './StatusFilter'
import { useAsyncData } from '../hooks/useAsyncData'

interface Props {
  /** Called after a new issue is created so the list refreshes. */
  refreshKey?: number
}

export function IssueList({ refreshKey }: Props) {
  const [statusFilter, setStatusFilter] = useState<IssueStatus | undefined>(undefined)

  const fetcher = useCallback(
    () => listIssues(statusFilter),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [statusFilter, refreshKey],
  )

  const { data, loading, error } = useAsyncData<IssueListResponse>(fetcher)

  return (
    <section className="issue-list-section">
      <div className="issue-list-toolbar">
        <StatusFilter value={statusFilter} onChange={setStatusFilter} />
      </div>

      {data && <SummaryBar summary={data.summary} />}

      {loading && (
        <div className="state-loading" role="status" aria-live="polite">
          Loading issues…
        </div>
      )}

      {error && (
        <div className="state-error" role="alert">
          <strong>Failed to load issues</strong>
          <p>{error.message}</p>
        </div>
      )}

      {data && !loading && (
        <>
          {data.issues.length === 0 ? (
            <div className="state-empty">
              {statusFilter
                ? `No issues with status "${statusFilter}".`
                : 'No issues yet. Create one above.'}
            </div>
          ) : (
            <ul className="issue-list" aria-label="Issues">
              {data.issues.map((issue) => (
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
