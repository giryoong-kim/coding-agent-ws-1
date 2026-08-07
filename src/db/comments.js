const { v4: uuidv4 } = require('uuid');
const { getDb } = require('./connection');
const { getIssueById } = require('./issues');

function createComment(issueId, body) {
  const issue = getIssueById(issueId);
  if (!issue) return { error: 'not_found' };

  const db = getDb();
  const id = uuidv4();
  const now = new Date().toISOString();

  const stmt = db.prepare(`
    INSERT INTO comments (id, issue_id, body, created_at)
    VALUES (?, ?, ?, ?)
  `);
  stmt.run(id, issueId, body, now);

  return { comment: getCommentById(id) };
}

function listComments(issueId) {
  const issue = getIssueById(issueId);
  if (!issue) return { error: 'not_found' };

  const db = getDb();
  const stmt = db.prepare('SELECT * FROM comments WHERE issue_id = ? ORDER BY created_at ASC');
  const rows = stmt.all(issueId);

  return { comments: rows.map(formatComment) };
}

function getCommentById(id) {
  const db = getDb();
  const stmt = db.prepare('SELECT * FROM comments WHERE id = ?');
  const row = stmt.get(id);
  return row ? formatComment(row) : null;
}

function formatComment(row) {
  return {
    id: row.id,
    issueId: row.issue_id,
    body: row.body,
    createdAt: row.created_at,
  };
}

module.exports = {
  createComment,
  listComments,
};
