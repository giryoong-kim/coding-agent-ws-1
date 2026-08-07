import { Link, useLocation } from 'react-router-dom'
import { API_ORIGIN } from '../../api/client'
import styles from './Header.module.css'

export function Header() {
  const location = useLocation()
  const onIssuesPage = location.pathname === '/'

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Link to="/" className={styles.brandLink} aria-label="Issue Tracker home">
            <svg
              className={styles.brandIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span className={styles.brandName}>Issue Tracker</span>
          </Link>
        </div>

        <nav className={styles.nav} aria-label="Main navigation">
          {!onIssuesPage && (
            <Link to="/" className={styles.navLink}>
              &larr; All Issues
            </Link>
          )}
        </nav>

        <div className={styles.endpoint} title={`API endpoint: ${API_ORIGIN}/api/v1`}>
          <span className={styles.endpointLabel}>API</span>
          <code className={styles.endpointValue}>{API_ORIGIN}</code>
        </div>
      </div>
    </header>
  )
}
