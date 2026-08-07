import { Link } from 'react-router-dom'
import type { Issue } from '../types'
import { STATUS_LABELS } from '../types'

interface Props {
  issue: Issue
}

export function IssueCard({ issue }: Props) {
  const createdDate = new Date(issue.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <article className="issue-card">
      <div className="issue-card-header">
        <Link to={`/issues/${issue.id}`} className="issue-card-title">
          {issue.title}
        </Link>
        <span className={`status-pill status-pill-${issue.status}`} aria-label={`Status: ${STATUS_LABELS[issue.status]}`}>
          {STATUS_LABELS[issue.status]}
        </span>
      </div>
      {issue.description && (
        <p className="issue-card-description">{issue.description}</p>
      )}
      <div className="issue-card-meta">
        <span className="issue-card-id" title="Issue ID">#{issue.id.slice(0, 8)}</span>
        <span className="issue-card-date">Created {createdDate}</span>
      </div>
    </article>
  )
}
