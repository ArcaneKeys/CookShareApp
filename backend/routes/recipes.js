const express = require('express');

module.exports = function(db) {
    const router = express.Router();
  
    router.get('/', (req, res) => {
      db.all('SELECT * FROM Recipes', [], (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ recipes: rows });
      });
    });
  
    router.post('/', (req, res) => {
      const { name, ingredients, instructions, pictureUrl, calories, protein, carbs, fat } = req.body;
      const stmt = db.prepare('INSERT INTO Recipes (name, ingredients, instructions, pictureUrl, calories, protein, carbs, fat) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
      stmt.run(name, ingredients, instructions, pictureUrl, calories, protein, carbs, fat, function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ id: this.lastID });
      });
    });
  
    router.put('/:id', (req, res) => {
      const { name, ingredients, instructions, pictureUrl, calories, protein, carbs, fat } = req.body;
      const { id } = req.params;
      const stmt = db.prepare('UPDATE Recipes SET name = ?, ingredients = ?, instructions = ?, pictureUrl = ?, calories = ?, protein = ?, carbs = ?, fat = ? WHERE id = ?');
      stmt.run(name, ingredients, instructions, pictureUrl, calories, protein, carbs, fat, id, function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ changes: this.changes });
      });
    });
  
    router.delete('/:id', (req, res) => {
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
  
    return router;
};
