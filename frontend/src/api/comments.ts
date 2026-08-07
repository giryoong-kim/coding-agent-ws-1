import { api } from './client'
import type { Comment, CommentsResponse } from '../types'

export function listComments(issueId: string): Promise<CommentsResponse> {
  return api.get<CommentsResponse>(`/issues/${encodeURIComponent(issueId)}/comments`)
}

export function addComment(issueId: string, body: string): Promise<Comment> {
  return api.post<Comment>(`/issues/${encodeURIComponent(issueId)}/comments`, { body })
}
