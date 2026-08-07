import { useState } from 'react';
import { resolveBackendOrigin } from './api/client.js';
import { SummaryPanel } from './components/SummaryPanel.jsx';
import { IssueList } from './components/IssueList.jsx';
import { IssueDetail } from './components/IssueDetail.jsx';
import { CreateIssueModal } from './components/CreateIssueModal.jsx';
import './styles/globals.css';

/**
 * App — root component.
 *
 * Navigation state:
 *   { name: 'list' }
 *   { name: 'detail', issueId: string }
 *
 * refreshKey is incremented whenever data changes (create, status change)
 * so that SummaryPanel and IssueList re-fetch automatically.
 */
export default function App() {
  const [view, setView] = useState({ name: 'list' });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Resolved once at render time; stable for the session.
  const backendOrigin = resolveBackendOrigin();

  function bumpRefresh() {
    setRefreshKey((k) => k + 1);
  }

  function handleSelectIssue(issueId) {
    setView({ name: 'detail', issueId });
  }

  function handleBack() {
    setView({ name: 'list' });
    bumpRefresh(); // re-fetch list in case status changed
  }

  function handleIssueCreated() {
    setShowCreateModal(false);
    bumpRefresh();
    // Stay on list view so the user sees the new issue
    setView({ name: 'list' });
  }

  function handleIssueChanged() {
    // Status changed on the detail view — refresh summary counts
    bumpRefresh();
  }

  return (
    <div className="app-shell">
      {/* ---- Header ---- */}
      <header className="app-header">
        <div className="app-header-inner">
          <h1 className="app-title">
            <span>Issue</span> Tracker
          </h1>
          <span
            className="backend-url"
            title={`Backend: ${backendOrigin}`}
            aria-label={`Connected to backend at ${backendOrigin}`}
          >
            API: {backendOrigin}
          </span>
        </div>
      </header>

      {/* ---- Main content ---- */}
      <main className="app-main">
        <div className="layout-columns">
          {/* Left sidebar: summary panel */}
          <SummaryPanel refreshKey={refreshKey} />

          {/* Right: list or detail */}
          <div>
            {view.name === 'list' && (
              <IssueList
                onSelectIssue={handleSelectIssue}
                onCreateClick={() => setShowCreateModal(true)}
                refreshKey={refreshKey}
              />
            )}

            {view.name === 'detail' && (
              <IssueDetail
                issueId={view.issueId}
                onBack={handleBack}
                onIssueChanged={handleIssueChanged}
              />
            )}
          </div>
        </div>
      </main>

      {/* ---- Create issue modal ---- */}
      {showCreateModal && (
        <CreateIssueModal
          onClose={() => setShowCreateModal(false)}
          onCreated={handleIssueCreated}
        />
      )}
    </div>
  );
}
