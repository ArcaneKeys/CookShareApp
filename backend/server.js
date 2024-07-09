const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Database setup
const dbPath = path.join(__dirname, 'recipes.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS Recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    ingredients TEXT NOT NULL,
    instructions TEXT NOT NULL,
    pictureUrl TEXT
  )`, () => {
    db.get('SELECT COUNT(*) as count FROM Recipes', (err, row) => {
      if (err) {
        console.error('Error checking Recipes count:', err);
        return;
      }
      if (row.count === 0) {
        // Insert initial data
        const insertStmt = db.prepare(`INSERT INTO Recipes (name, ingredients, instructions, pictureUrl) VALUES (?, ?, ?, ?)`);
        const recipes = [
          {
            name: 'Spaghetti Carbonara',
            ingredients: 'Spaghetti, Eggs, Parmesan, Bacon',
            instructions: 'Cook spaghetti. Mix eggs and parmesan. Fry bacon. Combine all.',
            pictureUrl: 'https://cdn.aniagotuje.com/pictures/articles/2020/01/1967586-v-1080x1080.jpg'
          },
          {
            name: 'Chicken Curry',
            ingredients: 'Chicken, Curry Paste, Coconut Milk',
            instructions: 'Cook chicken. Add curry paste and coconut milk. Simmer.',
            pictureUrl: 'https://cdn.aniagotuje.com/pictures/articles/2020/01/1967553-v-1080x1080.jpg'
          },
          {
            name: 'Beef Stroganoff',
            ingredients: 'Beef, Onions, Mushrooms, Sour Cream',
            instructions: 'Cook beef. Add onions and mushrooms. Stir in sour cream.',
            pictureUrl: 'https://cdn.aniagotuje.com/pictures/articles/2020/11/9751896-v-1080x1080.jpg'
          }
        ];

        recipes.forEach(recipe => {
          insertStmt.run(recipe.name, recipe.ingredients, recipe.instructions, recipe.pictureUrl);
        });

        insertStmt.finalize();
      }
    });
  });
});

// API endpoints
app.get('/recipes', (req, res) => {
  db.all('SELECT * FROM Recipes', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ recipes: rows });
  });
});

app.post('/recipes', (req, res) => {
  const { name, ingredients, instructions, pictureUrl } = req.body;
  const stmt = db.prepare('INSERT INTO Recipes (name, ingredients, instructions, pictureUrl) VALUES (?, ?, ?, ?)');
  stmt.run(name, ingredients, instructions, pictureUrl, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID });
  });
});

app.put('/recipes/:id', (req, res) => {
  const { name, ingredients, instructions, pictureUrl } = req.body;
  const { id } = req.params;
  const stmt = db.prepare('UPDATE Recipes SET name = ?, ingredients = ?, instructions = ?, pictureUrl = ? WHERE id = ?');
  stmt.run(name, ingredients, instructions, pictureUrl, id, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ changes: this.changes });
  });
});

app.delete('/recipes/:id', (req, res) => {
  const { id } = req.params;
  const stmt = db.prepare('DELETE FROM Recipes WHERE id = ?');
  stmt.run(id, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ changes: this.changes });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
