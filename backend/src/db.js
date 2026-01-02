const path = require("path");
const Database = require("better-sqlite3");

const dbPath = path.join(__dirname, "..", "data.sqlite");
const db = new Database(dbPath);

db.exec(`
  PRAGMA journal_mode = WAL;

  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('THU','CHI')),
    note TEXT NOT NULL DEFAULT '-',
    amount INTEGER NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_tx_date ON transactions(date);
`);

module.exports = db;
