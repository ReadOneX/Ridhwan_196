const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const isProd = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;
const dbPath = isProd ? '/tmp/database.sqlite' : path.resolve(__dirname, 'database.sqlite');

// If in production and file doesn't exist, we can try to seed it or just let it be created
if (isProd && !fs.existsSync(dbPath)) {
  console.log('Production: Database file not found in /tmp, it will be created');
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log(`Connected to SQLite database at ${dbPath}`);
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
      )`);
      db.run(`CREATE TABLE IF NOT EXISTS refresh_tokens (
        token TEXT PRIMARY KEY
      )`);
      db.run(`CREATE TABLE IF NOT EXISTS characters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        description TEXT,
        imageUrl TEXT
      )`);
    });
  }
});

module.exports = db;