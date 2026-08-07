import { StatusBadge } from './StatusBadge.jsx';

/**
 * IssueCard — a single row in the issue list.
 *
 * Props:
 *   issue: Issue object
 *   onSelect: (issueId: string) => void
 */
export function IssueCard({ issue, onSelect }) {
  const createdAt = new Date(issue.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  function handleClick() {
    onSelect(issue.id);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(issue.id);
    }
  }

  return (
    <article
      className="card issue-card"
      role="button"
      tabIndex={0}
      aria-label={`Issue: ${issue.title}, status ${issue.status}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <div className="issue-card-header">
        <h3 className="issue-card-title">{issue.title}</h3>
        <StatusBadge status={issue.status} />
      </div>
      <div className="issue-card-meta">
        <span className="issue-card-id" aria-label="Issue ID">
          #{issue.id.slice(0, 8)}
        </span>
        <span className="issue-card-date" aria-label={`Created ${createdAt}`}>
          {createdAt}
        </span>
      </div>
    </article>
  );
}
