import { api } from './client'
import type { Comment } from '../types'

export function listComments(issueId: string): Promise<Comment[]> {
  return api.get<Comment[]>(`/issues/${encodeURIComponent(issueId)}/comments`)
}

export function addComment(issueId: string, body: string): Promise<Comment> {
  return api.post<Comment>(`/issues/${encodeURIComponent(issueId)}/comments`, { body })
}
