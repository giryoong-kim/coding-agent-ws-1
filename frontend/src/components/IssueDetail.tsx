import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { getIssue } from '../api/issues'
import { listComments } from '../api/comments'
import type { Issue, CommentsResponse } from '../types'
import { STATUS_LABELS } from '../types'
import { StatusControl } from './StatusControl'
import { CommentThread } from './CommentThread'
import { AddCommentForm } from './AddCommentForm'
import { useAsyncData } from '../hooks/useAsyncData'

interface Props {
  issueId: string
}

export function IssueDetail({ issueId }: Props) {
  const [issueRefresh, setIssueRefresh] = useState(0)
  const [commentsRefresh, setCommentsRefresh] = useState(0)

  const issueFetcher = useCallback(
    () => getIssue(issueId),
    [issueId, issueRefresh],
  )
  const commentsFetcher = useCallback(
    () => listComments(issueId),
    [issueId, commentsRefresh],
  )

  const { data: issue, loading: issueLoading, error: issueError } = useAsyncData<Issue>(issueFetcher)
  const { data: commentsData, loading: commentsLoading, error: commentsError } = useAsyncData<CommentsResponse>(commentsFetcher)

  return (
    <div className="issue-detail">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/" className="breadcrumb-link">Issues</Link>
        <span className="breadcrumb-sep" aria-hidden="true"> / </span>
        <span className="breadcrumb-current" aria-current="page">
          {issue ? issue.title : issueId.slice(0, 8)}
        </span>
      </nav>

      {issueLoading && (
        <div className="state-loading" role="status" aria-live="polite">
          Loading issue…
        </div>
      )}

      {issueError && (
        <div className="state-error" role="alert">
          <strong>Failed to load issue</strong>
          <p>{issueError.message}</p>
        </div>
      )}

      {issue && (
        <article className="issue-detail-body">
          <header className="issue-detail-header">
            <div className="issue-detail-title-row">
              <h1 className="issue-detail-title">{issue.title}</h1>
              <span className={`status-pill status-pill-${issue.status}`} aria-label={`Status: ${STATUS_LABELS[issue.status]}`}>
                {STATUS_LABELS[issue.status]}
              </span>
            </div>
            <div className="issue-detail-meta">
              <span className="issue-detail-id" title="Issue ID">ID: {issue.id}</span>
              <span className="issue-detail-dates">
                Created{' '}
                <time dateTime={issue.createdAt}>
                  {new Date(issue.createdAt).toLocaleString(undefined, {
                    year: 'numeric', month: 'short', day: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </time>
                {issue.updatedAt !== issue.createdAt && (
                  <>
                    {' · Updated '}
                    <time dateTime={issue.updatedAt}>
                      {new Date(issue.updatedAt).toLocaleString(undefined, {
                        year: 'numeric', month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </time>
                  </>
                )}
              </span>
            </div>
          </header>

          {issue.description && (
            <section className="issue-description" aria-label="Description">
              <h2 className="section-heading">Description</h2>
              <p className="issue-description-text">{issue.description}</p>
            </section>
          )}

          <section className="issue-status-section" aria-label="Status controls">
            <h2 className="section-heading">Status</h2>
            <StatusControl
              issueId={issue.id}
              currentStatus={issue.status}
              onTransitioned={() => setIssueRefresh((n) => n + 1)}
            />
          </section>

          <section className="issue-comments-section" aria-label="Comments">
            <h2 className="section-heading">
              Comments
              {commentsData && ` (${commentsData.comments.length})`}
            </h2>

            {commentsLoading && (
              <div className="state-loading" role="status" aria-live="polite">
                Loading comments…
              </div>
            )}
            {commentsError && (
              <div className="state-error" role="alert">
                <strong>Failed to load comments</strong>
                <p>{commentsError.message}</p>
              </div>
            )}
            {commentsData && (
              <CommentThread comments={commentsData.comments} />
            )}

            <AddCommentForm
              issueId={issue.id}
              onAdded={() => setCommentsRefresh((n) => n + 1)}
            />
          </section>
        </article>
      )}
    </div>
  )
}
