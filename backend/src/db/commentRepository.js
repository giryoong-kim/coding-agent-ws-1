const { getDb } = require('./connection');
const { v4: uuidv4 } = require('uuid');

function toCommentObject(row) {
  return {
    id: row.id,
    issueId: row.issue_id,
    body: row.body,
    createdAt: row.created_at,
  };
}

function createComment(issueId, body) {
  const db = getDb();
  const id = uuidv4();
  const now = new Date().toISOString();

  const stmt = db.prepare(
    'INSERT INTO comments (id, issue_id, body, created_at) VALUES (?, ?, ?, ?)'
  );
  stmt.run(id, issueId, body, now);

  return { id, issueId, body, createdAt: now };
}

function getCommentsByIssueId(issueId) {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM comments WHERE issue_id = ? ORDER BY created_at ASC').all(issueId);
  return rows.map(toCommentObject);
}

module.exports = { createComment, getCommentsByIssueId };
