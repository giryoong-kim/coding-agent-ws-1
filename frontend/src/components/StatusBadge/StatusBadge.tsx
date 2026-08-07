import { statusLabel, type IssueStatus } from '../../types'
import styles from './StatusBadge.module.css'

interface Props {
  status: IssueStatus
  size?: 'sm' | 'md'
}

export function StatusBadge({ status, size = 'md' }: Props) {
  return (
    <span
      className={`${styles.badge} ${styles[status]} ${size === 'sm' ? styles.sm : ''}`}
      aria-label={`Status: ${statusLabel(status)}`}
    >
      {statusLabel(status)}
    </span>
  )
}
