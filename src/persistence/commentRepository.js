import { getDatabase } from './database.js';

export function createComment({ id, issueId, body, createdAt }) {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT INTO comments (id, issue_id, body, created_at)
    VALUES (?, ?, ?, ?)
  `);
  stmt.run(id, issueId, body, createdAt);
}

export function findCommentsByIssueId(issueId) {
  const db = getDatabase();
  const rows = db.prepare(
    'SELECT * FROM comments WHERE issue_id = ? ORDER BY created_at ASC'
  ).all(issueId);
  return rows.map(mapRow);
}

function mapRow(row) {
  return {
    id: row.id,
    issueId: row.issue_id,
    body: row.body,
    createdAt: row.created_at,
  };
}
