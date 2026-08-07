const issueRepo = require('../db/issueRepository');
const { validateCreateIssue, validateStatusUpdate, validateStatusTransition, validateStatusFilter } = require('./validation');

function createIssue(body) {
  const validation = validateCreateIssue(body);
  if (!validation.valid) {
    return { error: validation.error, status: 422 };
  }

  const title = body.title.trim();
  const description = typeof body.description === 'string' ? body.description : '';
  const issue = issueRepo.createIssue(title, description);
  return { data: issue, status: 201 };
}

function listIssues(statusFilter) {
  const validation = validateStatusFilter(statusFilter);
  if (!validation.valid) {
    return { error: validation.error, status: 422 };
  }

  const issues = issueRepo.listIssues(statusFilter || null);
  return { data: { issues }, status: 200 };
}

function getIssue(id) {
  const issue = issueRepo.getIssueById(id);
  if (!issue) {
    return { error: `Issue with id '${id}' not found`, status: 404 };
  }
  return { data: issue, status: 200 };
}

function updateStatus(id, body) {
  const issue = issueRepo.getIssueById(id);
  if (!issue) {
    return { error: `Issue with id '${id}' not found`, status: 404 };
  }

  const statusValidation = validateStatusUpdate(body);
  if (!statusValidation.valid) {
    return { error: statusValidation.error, status: 422 };
  }

  const transitionValidation = validateStatusTransition(issue.status, body.status);
  if (!transitionValidation.valid) {
    return { error: transitionValidation.error, status: 409 };
  }

  const updated = issueRepo.updateIssueStatus(id, body.status);
  return { data: updated, status: 200 };
}

function getSummary() {
  const counts = issueRepo.getStatusCounts();
  return { data: counts, status: 200 };
}

module.exports = { createIssue, listIssues, getIssue, updateStatus, getSummary };
