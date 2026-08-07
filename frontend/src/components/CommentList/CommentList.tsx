import type { Comment } from '../../types'
import styles from './CommentList.module.css'

interface Props {
  comments: Comment[]
}

export function CommentList({ comments }: Props) {
  if (comments.length === 0) {
    return (
      <p className={styles.empty} aria-live="polite">
        No comments yet. Be the first to add one below.
      </p>
    )
  }

  return (
    <ol className={styles.list} aria-label={`${comments.length} comment${comments.length !== 1 ? 's' : ''}`}>
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </ol>
  )
}

function CommentItem({ comment }: { comment: Comment }) {
  const date = new Date(comment.createdAt)
  const formatted = date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <li className={styles.comment}>
      <div className={styles.commentHeader}>
        <span className={styles.commentMeta}>
          <time
            className={styles.commentTime}
            dateTime={comment.createdAt}
            title={new Date(comment.createdAt).toISOString()}
          >
            {formatted}
          </time>
        </span>
        <code className={styles.commentId} title={`Comment ID: ${comment.id}`}>
          #{comment.id.slice(0, 8)}
        </code>
      </div>
      <p className={styles.commentBody}>{comment.body}</p>
    </li>
  )
}
