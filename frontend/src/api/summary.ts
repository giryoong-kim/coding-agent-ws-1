import { api } from './client'
import type { IssueSummary } from '../types'

export function getSummary(): Promise<IssueSummary> {
  return api.get<IssueSummary>('/summary')
}
