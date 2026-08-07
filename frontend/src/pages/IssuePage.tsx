import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import type { Issue, Comment } from '../types'
import { getIssue, listComments, ApiError } from '../api/client'
import { IssueDetail } from '../components/IssueDetail/IssueDetail'
import { CommentList } from '../components/CommentList/CommentList'
import { CommentForm } from '../components/CommentForm/CommentForm'
import { ErrorMessage } from '../components/ErrorMessage/ErrorMessage'
import { LoadingSpinner } from '../components/LoadingSpinner/LoadingSpinner'
import styles from './IssuePage.module.css'

export function IssuePage() {
  const { id } = useParams<{ id: string }>()
  const [issue, setIssue] = useState<Issue | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [issueLoading, setIssueLoading] = useState(true)
  const [commentsLoading, setCommentsLoading] = useState(true)
  const [issueError, setIssueError] = useState('')
  const [commentsError, setCommentsError] = useState('')

  useEffect(() => {
    if (!id) return

    // Fetch issue and comments in parallel
    setIssueLoading(true)
    setIssueError('')
    getIssue(id)
      .then((data) => setIssue(data))
      .catch((err) => {
        if (err instanceof ApiError) {
          setIssueError(
            err.status === 404
              ? `Issue "${id}" was not found.`
              : err.message,
          )
        } else {
          setIssueError('Failed to load issue.')
        }
      })
      .finally(() => setIssueLoading(false))

    setCommentsLoading(true)
    setCommentsError('')
    listComments(id)
      .then((data) => setComments(data.comments))
      .catch((err) => {
        if (err instanceof ApiError) {
          setCommentsError(err.message)
        } else {
          setCommentsError('Failed to load comments.')
        }
      })
      .finally(() => setCommentsLoading(false))
  }, [id])

  function handleStatusChanged(updated: Issue) {
    setIssue(updated)
  }

  function handleCommentPosted(comment: Comment) {
    setComments((prev) => [...prev, comment])
  }

  if (!id) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <ErrorMessage message="No issue ID in URL." />
        </div>
      </main>
    )
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Back link */}
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to="/" className={styles.backLink}>
            &larr; All Issues
          </Link>
        </nav>

        {/* Issue detail */}
        {issueLoading ? (
          <LoadingSpinner label="Loading issue…" />
        ) : issueError ? (
          <ErrorMessage
            message={issueError}
            context={`GET /api/v1/issues/${id}`}
          />
        ) : issue ? (
          <IssueDetail issue={issue} onStatusChanged={handleStatusChanged} />
        ) : null}

        {/* Comments section — shown whenever we have an issue (or once loaded) */}
        {!issueLoading && !issueError && issue && (
          <section className={styles.commentsSection} aria-labelledby="comments-heading">
            <h2 id="comments-heading" className={styles.commentsHeading}>
              Comments
              {comments.length > 0 && (
                <span className={styles.commentCount}>{comments.length}</span>
              )}
            </h2>

            {commentsLoading ? (
              <LoadingSpinner label="Loading comments…" size="sm" />
            ) : commentsError ? (
              <ErrorMessage
                message={commentsError}
                context={`GET /api/v1/issues/${id}/comments`}
              />
            ) : (
              <CommentList comments={comments} />
            )}

            <CommentForm issueId={id} onPosted={handleCommentPosted} />
          </section>
        )}
      </div>
    </main>
  )
}
