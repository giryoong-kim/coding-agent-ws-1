import styles from './ErrorMessage.module.css'

interface Props {
  message: string
  /** Optional extra context, e.g. which endpoint failed */
  context?: string
}

export function ErrorMessage({ message, context }: Props) {
  return (
    <div className={styles.error} role="alert" aria-live="assertive">
      <svg
        className={styles.icon}
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
      <div className={styles.content}>
        <p className={styles.message}>{message}</p>
        {context && <p className={styles.context}>{context}</p>}
      </div>
    </div>
  )
}
