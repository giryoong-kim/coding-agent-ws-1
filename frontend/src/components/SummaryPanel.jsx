import { useState, useEffect } from 'react';
import { api } from '../api/client.js';

/**
 * SummaryPanel — shows per-status issue counts from GET /api/v1/summary.
 *
 * Props:
 *   refreshKey: number — increment to trigger a re-fetch (e.g. after status changes)
 */
export function SummaryPanel({ refreshKey }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    api
      .getSummary()
      .then((data) => {
        if (!cancelled) {
          setSummary(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.error ?? 'Failed to load summary');
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  return (
    <aside className="card summary-panel" aria-label="Issue summary">
      <h2 className="summary-panel-title">Summary</h2>

      {loading && (
        <p className="summary-loading" role="status">
          <span className="spinner" aria-hidden="true" /> Loading…
        </p>
      )}

      {error && (
        <p className="summary-error" role="alert">
          {error}
        </p>
      )}

      {summary && !loading && (
        <ul className="summary-list" role="list">
          {[
            { key: 'open', label: 'Open' },
            { key: 'in_progress', label: 'In Progress' },
            { key: 'done', label: 'Done' },
          ].map(({ key, label }) => (
            <li key={key} className={`summary-item summary-item-${key}`}>
              <span className="summary-item-label">{label}</span>
              <span className="summary-item-count" aria-label={`${summary[key]} ${label}`}>
                {summary[key] ?? 0}
              </span>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
