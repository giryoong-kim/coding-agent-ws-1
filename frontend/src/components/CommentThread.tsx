import type { Comment } from '../types'

interface Props {
  comments: Comment[]
}

export function CommentThread({ comments }: Props) {
  if (comments.length === 0) {
    return (
      <div className="comment-thread-empty">
        No comments yet. Be the first to comment.
      </div>
    )
  }

  return (
    <ol className="comment-thread" aria-label="Comments">
      {comments.map((comment) => {
        const date = new Date(comment.createdAt).toLocaleString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
        return (
          <li key={comment.id} className="comment-item">
            <div className="comment-meta">
              <span className="comment-id" title="Comment ID">
                #{comment.id.slice(0, 8)}
              </span>
              <time className="comment-date" dateTime={comment.createdAt}>
                {date}
              </time>
            </div>
            <p className="comment-body">{comment.body}</p>
          </li>
        )
      })}
    </ol>
  )
}
