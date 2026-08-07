/**
 * Shared domain types matching the API contract in the integration brief.
 */

export type IssueStatus = 'open' | 'in_progress' | 'done'

export interface Issue {
  id: string
  title: string
  description: string
  status: IssueStatus
  createdAt: string
  updatedAt: string
}

export interface Comment {
  id: string
  issueId: string
  body: string
  createdAt: string
}

export interface IssueSummary {
  open: number
  in_progress: number
  done: number
}

export interface IssueListResponse {
  issues: Issue[]
  summary: IssueSummary
}

export interface CommentListResponse {
  comments: Comment[]
}

export interface ApiError {
  error: string
}

/**
 * Legal status transitions per the shared contract:
 * open -> in_progress -> done (no other moves allowed)
 */
export function getNextStatuses(current: IssueStatus): IssueStatus[] {
  switch (current) {
    case 'open':
      return ['in_progress']
    case 'in_progress':
      return ['done']
    case 'done':
      return []
  }
}

export function statusLabel(status: IssueStatus): string {
  switch (status) {
    case 'open':
      return 'Open'
    case 'in_progress':
      return 'In Progress'
    case 'done':
      return 'Done'
  }
}

export const ALL_STATUSES: IssueStatus[] = ['open', 'in_progress', 'done']
