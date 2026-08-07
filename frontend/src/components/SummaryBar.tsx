import type { IssueSummary } from '../types'

interface Props {
  summary: IssueSummary
}

export function SummaryBar({ summary }: Props) {
  return (
    <div className="summary-bar" role="region" aria-label="Issue counts by status">
      <span className="summary-item summary-open">
        <span className="summary-count">{summary.open}</span>
        <span className="summary-label">Open</span>
      </span>
      <span className="summary-divider" aria-hidden="true" />
      <span className="summary-item summary-in-progress">
        <span className="summary-count">{summary.in_progress}</span>
        <span className="summary-label">In Progress</span>
      </span>
      <span className="summary-divider" aria-hidden="true" />
      <span className="summary-item summary-done">
        <span className="summary-count">{summary.done}</span>
        <span className="summary-label">Done</span>
      </span>
    </div>
  )
}
