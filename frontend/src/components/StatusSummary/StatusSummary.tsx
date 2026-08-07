import type { IssueSummary } from '../../types'
import styles from './StatusSummary.module.css'

interface Props {
  summary: IssueSummary
}

export function StatusSummary({ summary }: Props) {
  const total = summary.open + summary.in_progress + summary.done

  return (
    <section className={styles.section} aria-labelledby="summary-heading">
      <h2 id="summary-heading" className={styles.srOnly}>
        Issue Summary
      </h2>
      <div className={styles.grid}>
        <SummaryCard
          label="Open"
          count={summary.open}
          total={total}
          variant="open"
        />
        <SummaryCard
          label="In Progress"
          count={summary.in_progress}
          total={total}
          variant="in_progress"
        />
        <SummaryCard
          label="Done"
          count={summary.done}
          total={total}
          variant="done"
        />
        <SummaryCard
          label="Total"
          count={total}
          total={total}
          variant="total"
        />
      </div>
    </section>
  )
}

interface CardProps {
  label: string
  count: number
  total: number
  variant: 'open' | 'in_progress' | 'done' | 'total'
}

function SummaryCard({ label, count, total, variant }: CardProps) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0

  return (
    <div className={`${styles.card} ${styles[variant]}`}>
      <span className={styles.cardLabel}>{label}</span>
      <span className={styles.cardCount}>{count}</span>
      {variant !== 'total' && (
        <span className={styles.cardPct} aria-label={`${pct}% of all issues`}>
          {pct}%
        </span>
      )}
    </div>
  )
}
