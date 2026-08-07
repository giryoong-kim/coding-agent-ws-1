import { getDatabase } from './database.js';

export function createIssue({ id, title, description, status, createdAt, updatedAt }) {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT INTO issues (id, title, description, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  stmt.run(id, title, description, status, createdAt, updatedAt);
}

export function findIssueById(id) {
  const db = getDatabase();
  const row = db.prepare('SELECT * FROM issues WHERE id = ?').get(id);
  return row ? mapRow(row) : null;
}

export function findIssues(statusFilter) {
  const db = getDatabase();
  let rows;
  if (statusFilter) {
    rows = db.prepare('SELECT * FROM issues WHERE status = ? ORDER BY created_at DESC').all(statusFilter);
  } else {
    rows = db.prepare('SELECT * FROM issues ORDER BY created_at DESC').all();
  }
  return rows.map(mapRow);
}

export function updateIssueStatus(id, status, updatedAt) {
  const db = getDatabase();
  const stmt = db.prepare('UPDATE issues SET status = ?, updated_at = ? WHERE id = ?');
  stmt.run(status, updatedAt, id);
}

export function getStatusCounts() {
  const db = getDatabase();
  const rows = db.prepare(`
    SELECT status, COUNT(*) as count FROM issues GROUP BY status
  `).all();

  const summary = { open: 0, in_progress: 0, done: 0 };
  for (const row of rows) {
    summary[row.status] = row.count;
  }
  return summary;
}

function mapRow(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
