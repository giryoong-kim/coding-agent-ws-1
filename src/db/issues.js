const { v4: uuidv4 } = require('uuid');
const { getDb } = require('./connection');

const VALID_STATUSES = ['open', 'in_progress', 'done'];

const ALLOWED_TRANSITIONS = {
  open: ['in_progress'],
  in_progress: ['done'],
  done: [],
};

function createIssue(title, description) {
  const db = getDb();
  const id = uuidv4();
  const now = new Date().toISOString();

  const stmt = db.prepare(`
    INSERT INTO issues (id, title, description, status, created_at, updated_at)
    VALUES (?, ?, ?, 'open', ?, ?)
  `);
  stmt.run(id, title, description || '', now, now);

  return getIssueById(id);
}

function listIssues(statusFilter) {
  const db = getDb();

  let issuesQuery;
  if (statusFilter) {
    issuesQuery = db.prepare('SELECT * FROM issues WHERE status = ? ORDER BY created_at DESC');
  } else {
    issuesQuery = db.prepare('SELECT * FROM issues ORDER BY created_at DESC');
  }

  const issues = statusFilter ? issuesQuery.all(statusFilter) : issuesQuery.all();

  const summaryQuery = db.prepare(`
    SELECT status, COUNT(*) as count FROM issues GROUP BY status
  `);
  const summaryRows = summaryQuery.all();

  const summary = { open: 0, in_progress: 0, done: 0 };
  for (const row of summaryRows) {
    summary[row.status] = row.count;
  }

  return {
    issues: issues.map(formatIssue),
    summary,
  };
}

function getIssueById(id) {
  const db = getDb();
  const stmt = db.prepare('SELECT * FROM issues WHERE id = ?');
  const row = stmt.get(id);
  return row ? formatIssue(row) : null;
}

function updateIssueStatus(id, newStatus) {
  const issue = getIssueById(id);
  if (!issue) return { error: 'not_found' };

  if (!VALID_STATUSES.includes(newStatus)) {
    return { error: 'invalid_status', message: `Status must be one of: ${VALID_STATUSES.join(', ')}` };
  }

  const allowed = ALLOWED_TRANSITIONS[issue.status];
  if (!allowed.includes(newStatus)) {
    return {
      error: 'illegal_transition',
      message: `Cannot transition from '${issue.status}' to '${newStatus}'. Allowed transitions: ${allowed.length ? allowed.join(', ') : 'none (terminal state)'}`,
    };
  }

  const db = getDb();
  const now = new Date().toISOString();
  const stmt = db.prepare('UPDATE issues SET status = ?, updated_at = ? WHERE id = ?');
  stmt.run(newStatus, now, id);

  return { issue: getIssueById(id) };
}

function formatIssue(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

module.exports = {
  createIssue,
  listIssues,
  getIssueById,
  updateIssueStatus,
  VALID_STATUSES,
};
