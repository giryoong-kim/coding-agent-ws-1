import type { IssueStatus } from '../types'
import { ALL_STATUSES, STATUS_LABELS } from '../types'

interface Props {
  value: IssueStatus | undefined
  onChange: (status: IssueStatus | undefined) => void
}

export function StatusFilter({ value, onChange }: Props) {
  return (
    <div className="status-filter" role="group" aria-label="Filter issues by status">
      <button
        type="button"
        className={`status-filter-btn${value === undefined ? ' active' : ''}`}
        onClick={() => onChange(undefined)}
        aria-pressed={value === undefined}
      >
        All
      </button>
      {ALL_STATUSES.map((s) => (
        <button
          key={s}
          type="button"
          className={`status-filter-btn status-pill-${s}${value === s ? ' active' : ''}`}
          onClick={() => onChange(s)}
          aria-pressed={value === s}
        >
          {STATUS_LABELS[s]}
        </button>
      ))}
    </div>
  )
}
