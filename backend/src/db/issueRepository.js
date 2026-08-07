const { getDb } = require('./connection');
const { v4: uuidv4 } = require('uuid');

function toIssueObject(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function createIssue(title, description) {
  const db = getDb();
  const id = uuidv4();
  const now = new Date().toISOString();

  const stmt = db.prepare(
    'INSERT INTO issues (id, title, description, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)'
  );
  stmt.run(id, title, description, 'open', now, now);

  return { id, title, description, status: 'open', createdAt: now, updatedAt: now };
}

function listIssues(status) {
  const db = getDb();
  let rows;
  if (status) {
    rows = db.prepare('SELECT * FROM issues WHERE status = ? ORDER BY created_at DESC').all(status);
  } else {
    rows = db.prepare('SELECT * FROM issues ORDER BY created_at DESC').all();
  }
  return rows.map(toIssueObject);
}

function getIssueById(id) {
  const db = getDb();
  const row = db.prepare('SELECT * FROM issues WHERE id = ?').get(id);
  return row ? toIssueObject(row) : null;
}

function updateIssueStatus(id, newStatus) {
  const db = getDb();
  const now = new Date().toISOString();
  const stmt = db.prepare('UPDATE issues SET status = ?, updated_at = ? WHERE id = ?');
  stmt.run(newStatus, now, id);

  return getIssueById(id);
}

function getStatusCounts() {
  const db = getDb();
  const rows = db.prepare('SELECT status, COUNT(*) as count FROM issues GROUP BY status').all();
  const counts = { open: 0, in_progress: 0, done: 0 };
  for (const row of rows) {
    counts[row.status] = row.count;
  }
  return counts;
}

module.exports = { createIssue, listIssues, getIssueById, updateIssueStatus, getStatusCounts };
