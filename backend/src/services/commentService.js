const commentRepo = require('../db/commentRepository');
const issueRepo = require('../db/issueRepository');
const { validateCreateComment } = require('./validation');

function addComment(issueId, body) {
  const issue = issueRepo.getIssueById(issueId);
  if (!issue) {
    return { error: `Issue with id '${issueId}' not found`, status: 404 };
  }

  const validation = validateCreateComment(body);
  if (!validation.valid) {
    return { error: validation.error, status: 422 };
  }

  const comment = commentRepo.createComment(issueId, body.body.trim());
  return { data: comment, status: 201 };
}

function getComments(issueId) {
  const issue = issueRepo.getIssueById(issueId);
  if (!issue) {
    return { error: `Issue with id '${issueId}' not found`, status: 404 };
  }

  const comments = commentRepo.getCommentsByIssueId(issueId);
  return { data: { comments }, status: 200 };
}

module.exports = { addComment, getComments };
