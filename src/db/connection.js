const Database = require('better-sqlite3');
const path = require('path');
const { SCHEMA_SQL } = require('./schema');

const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), 'data', 'issues.db');

let db = null;

function getDb() {
  if (db) return db;

  const fs = require('fs');
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.exec(SCHEMA_SQL);

  return db;
}

function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}

module.exports = { getDb, closeDb };
