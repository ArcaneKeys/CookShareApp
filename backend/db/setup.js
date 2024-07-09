const sqlite3 = require('sqlite3').verbose();

function setupDatabase(dbPath) {
  const db = new sqlite3.Database(dbPath);
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS Recipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      ingredients TEXT NOT NULL,
      instructions TEXT NOT NULL,
      pictureUrl TEXT,
      calories INTEGER,
      protein INTEGER,
      carbs INTEGER,
      fat INTEGER
    )`);
  });
  return db;
}

module.exports = { setupDatabase };
