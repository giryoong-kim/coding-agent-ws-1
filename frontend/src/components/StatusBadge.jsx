/**
 * StatusBadge — colored pill showing an issue status.
 * Props:
 *   status: 'open' | 'in_progress' | 'done'
 */
export function StatusBadge({ status }) {
  const labels = {
    open: 'Open',
    in_progress: 'In Progress',
    done: 'Done',
  };

  const label = labels[status] ?? status;

  return (
    <span
      className={`status-badge status-badge-${status}`}
      aria-label={`Status: ${label}`}
    >
      {label}
    </span>
  );
}
