import { useState } from 'react'
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import { IssueList } from './components/IssueList'
import { IssueDetail } from './components/IssueDetail'
import { CreateIssueForm } from './components/CreateIssueForm'
import { API_PREFIX, API_BASE } from './api/client'

// ─── Detail page wrapper — pulls :id from the URL ────────────────────────────

function IssueDetailPage() {
  const { id } = useParams<{ id: string }>()
  if (!id) return <div className="state-error" role="alert">Missing issue ID.</div>
  return <IssueDetail issueId={id} />
}

// ─── Issue list page ──────────────────────────────────────────────────────────

function IssueListPage() {
  // Bump this to trigger a list refresh after a new issue is created.
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div className="page-layout">
      <aside className="page-sidebar">
        <CreateIssueForm onCreated={() => setRefreshKey((k) => k + 1)} />
      </aside>
      <main className="page-main">
        <IssueList refreshKey={refreshKey} />
      </main>
    </div>
  )
}

// ─── App shell ────────────────────────────────────────────────────────────────

export default function App() {
  const resolvedOrigin = API_BASE || window.location.origin
  const displayEndpoint = API_PREFIX

  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="app-header">
          <div className="app-header-inner">
            <a href="/" className="app-logo" aria-label="Issue Tracker home">
              <svg
                aria-hidden="true"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              Issue Tracker
            </a>
            <div className="app-endpoint" title={`API calls go to: ${displayEndpoint}`}>
              <span className="app-endpoint-label">API</span>
              <span className="app-endpoint-value">{resolvedOrigin || '(same origin)'}</span>
            </div>
          </div>
        </header>

        <div className="app-content">
          <Routes>
            <Route path="/" element={<IssueListPage />} />
            <Route path="/issues/:id" element={<IssueDetailPage />} />
          </Routes>
        </div>

        <footer className="app-footer">
          <span>
            Backend:{' '}
            <code className="endpoint-code">{displayEndpoint}</code>
            {' · '}
            Override with{' '}
            <code className="endpoint-code">?endpoint=&lt;url&gt;</code>
          </span>
        </footer>
      </div>
    </BrowserRouter>
  )
}
