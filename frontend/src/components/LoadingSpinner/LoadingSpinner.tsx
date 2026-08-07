import styles from './LoadingSpinner.module.css'

interface Props {
  label?: string
  size?: 'sm' | 'md' | 'lg'
}

export function LoadingSpinner({ label = 'Loading…', size = 'md' }: Props) {
  return (
    <div className={`${styles.wrapper} ${styles[size]}`} role="status" aria-label={label}>
      <div className={styles.spinner} aria-hidden="true" />
      <span className={styles.label}>{label}</span>
    </div>
  )
}
