const sqlite3 = require('sqlite3').verbose();

function setupDatabase(dbPath) {
  const db = new sqlite3.Database(dbPath);
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS Recipes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        instructions TEXT NOT NULL,
        pictureUrl TEXT,
        preparationTime INTEGER,
        calories INTEGER,
        protein INTEGER,
        carbs INTEGER,
        fat INTEGER
      )`);

    db.run(`CREATE TABLE IF NOT EXISTS Ingredients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        unit TEXT,
        iconUrl TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS RecipeIngredients (
        recipeId INTEGER,
        ingredientId INTEGER,
        quantity REAL,
        FOREIGN KEY (recipeId) REFERENCES Recipes(id),
        FOREIGN KEY (ingredientId) REFERENCES Ingredients(id)
      )`);
  
    db.run(`CREATE TABLE IF NOT EXISTS Categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    )`);
  
    db.run(`CREATE TABLE IF NOT EXISTS RecipeCategories (
        recipeId INTEGER,
        categoryId INTEGER,
        FOREIGN KEY (recipeId) REFERENCES Recipes(id),
        FOREIGN KEY (categoryId) REFERENCES Categories(id)
    )`);
  
    db.run(`CREATE TABLE IF NOT EXISTS Favorites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        recipeId INTEGER,
        FOREIGN KEY (recipeId) REFERENCES Recipes(id)
    )`);
  
    db.run(`CREATE TABLE IF NOT EXISTS Comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        recipeId INTEGER,
        comment TEXT,
        author TEXT,
        date TEXT,
        FOREIGN KEY (recipeId) REFERENCES Recipes(id)
    )`);
  });
  return db;
}

module.exports = { setupDatabase };
