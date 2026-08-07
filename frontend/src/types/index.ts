// Shared TypeScript types matching the integration-brief shared contract.

export type IssueStatus = 'open' | 'in_progress' | 'done'

export interface Issue {
  id: string          // UUID v4
  title: string
  description: string
  status: IssueStatus
  createdAt: string   // ISO 8601
  updatedAt: string   // ISO 8601
}

export interface Comment {
  id: string          // UUID v4
  issueId: string     // UUID v4
  body: string
  createdAt: string   // ISO 8601
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

export interface CommentsResponse {
  comments: Comment[]
}

export interface ApiError {
  error: string
}

// Status lifecycle helpers
export const STATUS_LABELS: Record<IssueStatus, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  done: 'Done',
}

/** Returns the single legal next status, or null if already done. */
export function nextStatus(current: IssueStatus): IssueStatus | null {
  if (current === 'open') return 'in_progress'
  if (current === 'in_progress') return 'done'
  return null
}

/** All status values that are valid filter values (plus undefined = "all"). */
export const ALL_STATUSES: IssueStatus[] = ['open', 'in_progress', 'done']
