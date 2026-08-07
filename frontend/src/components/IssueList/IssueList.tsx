import { Link } from 'react-router-dom'
import type { Issue, IssueStatus } from '../../types'
import { ALL_STATUSES, statusLabel } from '../../types'
import { StatusBadge } from '../StatusBadge/StatusBadge'
import styles from './IssueList.module.css'

interface Props {
  issues: Issue[]
  activeFilter: IssueStatus | ''
  onFilterChange: (status: IssueStatus | '') => void
}

export function IssueList({ issues, activeFilter, onFilterChange }: Props) {
  return (
    <section className={styles.section} aria-labelledby="issues-heading">
      <div className={styles.header}>
        <h2 id="issues-heading" className={styles.heading}>
          Issues
          {issues.length > 0 && (
            <span className={styles.count} aria-label={`${issues.length} issues`}>
              {issues.length}
            </span>
          )}
        </h2>

        <div className={styles.filterGroup} role="group" aria-label="Filter issues by status">
          <FilterButton
            label="All"
            active={activeFilter === ''}
            onClick={() => onFilterChange('')}
          />
          {ALL_STATUSES.map((s) => (
            <FilterButton
              key={s}
              label={statusLabel(s)}
              active={activeFilter === s}
              onClick={() => onFilterChange(s)}
              status={s}
            />
          ))}
        </div>
      </div>

      {issues.length === 0 ? (
        <EmptyState filtered={activeFilter !== ''} />
      ) : (
        <ul className={styles.list} aria-label="Issue list">
          {issues.map((issue) => (
            <IssueRow key={issue.id} issue={issue} />
          ))}
        </ul>
      )}
    </section>
  )
}

interface FilterButtonProps {
  label: string
  active: boolean
  onClick: () => void
  status?: IssueStatus
}

function FilterButton({ label, active, onClick, status }: FilterButtonProps) {
  return (
    <button
      type="button"
      className={`${styles.filterBtn} ${active ? styles.filterBtnActive : ''} ${status ? styles[`filter_${status}`] : ''}`}
      onClick={onClick}
      aria-pressed={active}
    >
      {label}
    </button>
  )
}

function IssueRow({ issue }: { issue: Issue }) {
  const date = new Date(issue.createdAt)
  const formatted = date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <li className={styles.row}>
      <Link to={`/issues/${issue.id}`} className={styles.rowLink} aria-label={`View issue: ${issue.title}`}>
        <div className={styles.rowMain}>
          <span className={styles.rowTitle}>{issue.title}</span>
          {issue.description && (
            <span className={styles.rowDesc}>{issue.description}</span>
          )}
        </div>
        <div className={styles.rowMeta}>
          <StatusBadge status={issue.status} size="sm" />
          <time
            className={styles.rowDate}
            dateTime={issue.createdAt}
            title={new Date(issue.createdAt).toISOString()}
          >
            {formatted}
          </time>
        </div>
      </Link>
    </li>
  )
}

function EmptyState({ filtered }: { filtered: boolean }) {
  return (
    <div className={styles.empty} aria-live="polite">
      <svg
        className={styles.emptyIcon}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
        focusable="false"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
      <p className={styles.emptyText}>
        {filtered ? 'No issues match this filter.' : 'No issues yet. Create the first one above.'}
      </p>
    </div>
  )
}
