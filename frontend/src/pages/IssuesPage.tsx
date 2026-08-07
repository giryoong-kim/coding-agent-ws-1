import { useState, useEffect, useCallback } from 'react'
import type { Issue, IssueStatus } from '../types'
import { listIssues, ApiError } from '../api/client'
import { IssueForm } from '../components/IssueForm/IssueForm'
import { IssueList } from '../components/IssueList/IssueList'
import { StatusSummary } from '../components/StatusSummary/StatusSummary'
import { ErrorMessage } from '../components/ErrorMessage/ErrorMessage'
import { LoadingSpinner } from '../components/LoadingSpinner/LoadingSpinner'
import type { IssueSummary } from '../types'
import styles from './IssuesPage.module.css'

export function IssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [summary, setSummary] = useState<IssueSummary>({ open: 0, in_progress: 0, done: 0 })
  const [statusFilter, setStatusFilter] = useState<IssueStatus | ''>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchIssues = useCallback(async (filter: IssueStatus | '') => {
    setLoading(true)
    setError('')
    try {
      const data = await listIssues(filter)
      setIssues(data.issues)
      setSummary(data.summary)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Failed to load issues. Is the backend running?')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchIssues(statusFilter)
  }, [fetchIssues, statusFilter])

  function handleFilterChange(filter: IssueStatus | '') {
    setStatusFilter(filter)
  }

  function handleIssueCreated(newIssue: Issue) {
    // Refresh the full list so summary counts stay accurate
    fetchIssues(statusFilter)
    // Optimistically add to list if it matches the current filter
    if (!statusFilter || newIssue.status === statusFilter) {
      setIssues((prev) => [newIssue, ...prev])
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Summary row — always sourced from GET /api/v1/issues */}
        {!error && (
          <StatusSummary summary={summary} />
        )}

        {/* Create issue */}
        <IssueForm onCreated={handleIssueCreated} />

        {/* Issue list with filter */}
        <section className={styles.listSection}>
          {error ? (
            <ErrorMessage
              message={error}
              context="GET /api/v1/issues"
            />
          ) : loading ? (
            <div className={styles.loadingWrapper}>
              <LoadingSpinner label="Loading issues…" />
            </div>
          ) : (
            <IssueList
              issues={issues}
              activeFilter={statusFilter}
              onFilterChange={handleFilterChange}
            />
          )}
        </section>
      </div>
    </main>
  )
}
