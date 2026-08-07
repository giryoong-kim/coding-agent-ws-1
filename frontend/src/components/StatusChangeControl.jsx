import { useState } from 'react';
import { api } from '../api/client.js';
import { StatusBadge } from './StatusBadge.jsx';

/**
 * Legal status transitions per the shared contract:
 *   open -> in_progress
 *   in_progress -> done
 *   done -> (terminal, no further transitions)
 */
const TRANSITIONS = {
  open: ['in_progress'],
  in_progress: ['done'],
  done: [],
};

const STATUS_LABELS = {
  in_progress: 'Mark In Progress',
  done: 'Mark Done',
};

/**
 * StatusChangeControl — shows the current status and buttons for available transitions.
 *
 * Props:
 *   issue: Issue object
 *   onStatusChanged: (updatedIssue) => void — called after a successful transition
 */
export function StatusChangeControl({ issue, onStatusChanged }) {
  const [transitioning, setTransitioning] = useState(false);
  const [error, setError] = useState('');

  const nextStatuses = TRANSITIONS[issue.status] ?? [];

  async function handleTransition(newStatus) {
    setTransitioning(true);
    setError('');

    try {
      const updated = await api.updateIssueStatus(issue.id, newStatus);
      onStatusChanged(updated);
    } catch (err) {
      // 409 = illegal transition, 422 = invalid status value — both surface to the user
      setError(err.error ?? 'Failed to update status.');
    } finally {
      setTransitioning(false);
    }
  }

  return (
    <div className="card status-control">
      <h3 className="status-control-title">Status</h3>

      <div className="status-control-current">
        <span className="text-secondary" style={{ fontSize: 'var(--text-sm)' }}>
          Current:
        </span>
        <StatusBadge status={issue.status} />
      </div>

      {error && (
        <div role="alert" className="error-banner mt-2">
          {error}
        </div>
      )}

      {nextStatuses.length > 0 ? (
        <div className="status-control-transitions" aria-label="Available transitions">
          {nextStatuses.map((next) => (
            <button
              key={next}
              type="button"
              className={`status-transition-btn status-transition-btn-${next}`}
              onClick={() => handleTransition(next)}
              disabled={transitioning}
              aria-busy={transitioning}
            >
              {transitioning ? (
                <>
                  <span className="spinner" aria-hidden="true" />
                  Updating…
                </>
              ) : (
                STATUS_LABELS[next] ?? next
              )}
            </button>
          ))}
        </div>
      ) : (
        <p className="status-control-terminal mt-2">
          This issue is closed. No further transitions are available.
        </p>
      )}
    </div>
  );
}
