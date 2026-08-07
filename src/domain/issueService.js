import { v4 as uuidv4 } from 'uuid';
import * as issueRepo from '../persistence/issueRepository.js';
import * as commentRepo from '../persistence/commentRepository.js';
import { isValidStatus, isValidTransition } from './statuses.js';

export function createIssue(title, description) {
  if (title === undefined || title === null || typeof title !== 'string' || title.trim() === '') {
    return { error: 'Title is required and cannot be empty', status: 400 };
  }
  if (description === undefined || description === null || typeof description !== 'string') {
    return { error: 'Description is required (may be an empty string)', status: 400 };
  }

  const now = new Date().toISOString();
  const issue = {
    id: uuidv4(),
    title: title.trim(),
    description,
    status: 'open',
    createdAt: now,
    updatedAt: now,
  };

  issueRepo.createIssue(issue);
  return { data: issue, status: 201 };
}

export function getIssues(statusFilter) {
  if (statusFilter && !isValidStatus(statusFilter)) {
    return { error: `Invalid status filter: '${statusFilter}'. Must be one of: open, in_progress, done`, status: 400 };
  }

  const issues = issueRepo.findIssues(statusFilter || null);
  return { data: issues, status: 200 };
}

export function getSummary() {
  const summary = issueRepo.getStatusCounts();
  return { data: summary, status: 200 };
}

export function getIssueById(id) {
  const issue = issueRepo.findIssueById(id);
  if (!issue) {
    return { error: `Issue not found: ${id}`, status: 404 };
  }
  return { data: issue, status: 200 };
}

export function transitionStatus(id, newStatus) {
  if (!newStatus || !isValidStatus(newStatus)) {
    return { error: `Invalid status: '${newStatus}'. Must be one of: open, in_progress, done`, status: 400 };
  }

  const issue = issueRepo.findIssueById(id);
  if (!issue) {
    return { error: `Issue not found: ${id}`, status: 404 };
  }

  if (!isValidTransition(issue.status, newStatus)) {
    return {
      error: `Invalid status transition from '${issue.status}' to '${newStatus}'. Allowed transitions: open -> in_progress, in_progress -> done`,
      status: 422,
    };
  }

  const updatedAt = new Date().toISOString();
  issueRepo.updateIssueStatus(id, newStatus, updatedAt);

  return { data: { ...issue, status: newStatus, updatedAt }, status: 200 };
}

export function addComment(issueId, body) {
  if (!body || typeof body !== 'string' || body.trim() === '') {
    return { error: 'Comment body is required and cannot be blank', status: 400 };
  }

  const issue = issueRepo.findIssueById(issueId);
  if (!issue) {
    return { error: `Issue not found: ${issueId}`, status: 404 };
  }

  const comment = {
    id: uuidv4(),
    issueId,
    body: body.trim(),
    createdAt: new Date().toISOString(),
  };

  commentRepo.createComment(comment);
  return { data: comment, status: 201 };
}

export function getComments(issueId) {
  const issue = issueRepo.findIssueById(issueId);
  if (!issue) {
    return { error: `Issue not found: ${issueId}`, status: 404 };
  }

  const comments = commentRepo.findCommentsByIssueId(issueId);
  return { data: comments, status: 200 };
}
