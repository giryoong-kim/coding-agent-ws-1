import { useState, useEffect } from 'react';
import { api } from '../api/client.js';
import { IssueCard } from './IssueCard.jsx';

const STATUS_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

/**
 * IssueList — shows the full list of issues with status filter tabs.
 *
 * Props:
 *   onSelectIssue: (issueId: string) => void
 *   onCreateClick: () => void
 *   refreshKey: number — increment to force re-fetch
 */
export function IssueList({ onSelectIssue, onCreateClick, refreshKey }) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    api
      .getIssues(statusFilter)
      .then((data) => {
        if (!cancelled) {
          setIssues(data.issues ?? []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.error ?? 'Failed to load issues');
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [statusFilter, refreshKey]);

  return (
    <section aria-label="Issue list">
      <div className="issue-list-header">
        <h1 className="issue-list-title">Issues</h1>

        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Status filter tabs */}
          <nav
            className="filter-bar"
            role="group"
            aria-label="Filter issues by status"
          >
            {STATUS_FILTERS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                className={`filter-btn${statusFilter === value ? ' active' : ''}`}
                aria-pressed={statusFilter === value}
                onClick={() => setStatusFilter(value)}
              >
                {label}
              </button>
            ))}
          </nav>

          <button
            type="button"
            className="btn btn-primary"
            onClick={onCreateClick}
          >
            + New Issue
          </button>
        </div>
      </div>

      {loading && (
        <div className="issue-list-loading" role="status" aria-live="polite">
          <span className="spinner" aria-hidden="true" />
          <span className="sr-only">Loading issues…</span>
          <span aria-hidden="true" style={{ marginLeft: 'var(--space-2)' }}>
            Loading…
          </span>
        </div>
      )}

      {error && !loading && (
        <div className="issue-list-error" role="alert">
          <div className="error-banner">{error}</div>
        </div>
      )}

      {!loading && !error && issues.length === 0 && (
        <div className="issue-list-empty">
          <p>No issues found.</p>
          <button type="button" className="btn btn-primary" onClick={onCreateClick}>
            Create the first issue
          </button>
        </div>
      )}

      {!loading && !error && issues.length > 0 && (
        <div className="issues-grid" role="list">
          {issues.map((issue) => (
            <div key={issue.id} role="listitem">
              <IssueCard issue={issue} onSelect={onSelectIssue} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
