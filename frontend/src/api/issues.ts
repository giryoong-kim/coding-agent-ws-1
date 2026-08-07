import { api } from './client'
import type {
  Issue,
  IssueListResponse,
  IssueStatus,
} from '../types'

export function listIssues(status?: IssueStatus): Promise<IssueListResponse> {
  const qs = status ? `?status=${encodeURIComponent(status)}` : ''
  return api.get<IssueListResponse>(`/issues${qs}`)
}

export function getIssue(id: string): Promise<Issue> {
  return api.get<Issue>(`/issues/${encodeURIComponent(id)}`)
}

export function createIssue(title: string, description: string): Promise<Issue> {
  return api.post<Issue>('/issues', { title, description })
}

export function transitionStatus(id: string, status: IssueStatus): Promise<Issue> {
  return api.patch<Issue>(`/issues/${encodeURIComponent(id)}/status`, { status })
}
