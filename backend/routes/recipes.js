const express = require('express');

module.exports = function(db) {
    const router = express.Router();
  
    router.get('/', (req, res) => {
        db.all('SELECT * FROM Recipes', [], (err, recipes) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          const queryIngredients = `
            SELECT ri.recipeId, ri.quantity, i.name, i.unit, i.iconUrl 
            FROM RecipeIngredients ri
            JOIN Ingredients i ON ri.ingredientId = i.id
          `;
          db.all(queryIngredients, [], (err, ingredients) => {
            if (err) {
              res.status(500).json({ error: err.message });
              return;
            }
            const queryCategories = `
              SELECT rc.recipeId, c.name 
              FROM RecipeCategories rc
              JOIN Categories c ON rc.categoryId = c.id
            `;
            db.all(queryCategories, [], (err, categories) => {
              if (err) {
                res.status(500).json({ error: err.message });
                return;
              }
              const recipesWithDetails = recipes.map(recipe => {
                return {
                  ...recipe,
                  ingredients: ingredients.filter(ingredient => ingredient.recipeId === recipe.id),
                  categories: categories.filter(category => category.recipeId === recipe.id).map(category => category.name)
                };
              });
              res.json({ recipes: recipesWithDetails });
            });
          });
        });
    });
  
    router.post('/', (req, res) => {
        const { name, instructions, pictureUrl, preparationTime, calories, protein, carbs, fat, ingredients, categories } = req.body;
        const insertRecipe = db.prepare('INSERT INTO Recipes (name, instructions, pictureUrl, preparationTime, calories, protein, carbs, fat) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
        insertRecipe.run(name, instructions, pictureUrl, preparationTime, calories, protein, carbs, fat, function(err) {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          const recipeId = this.lastID;
          const insertIngredient = db.prepare('INSERT INTO RecipeIngredients (recipeId, ingredientId, quantity) VALUES (?, ?, ?)');
          ingredients.forEach(ingredient => {
            insertIngredient.run(recipeId, ingredient.ingredientId, ingredient.quantity);
          });
          insertIngredient.finalize();
    
          const insertCategory = db.prepare('INSERT INTO RecipeCategories (recipeId, categoryId) VALUES (?, ?)');
          categories.forEach(categoryId => {
            insertCategory.run(recipeId, categoryId);
          });
          insertCategory.finalize();
    
          res.json({ id: recipeId });
        });
    });
  
    router.put('/:id', (req, res) => {
        const { name, instructions, pictureUrl, preparationTime, calories, protein, carbs, fat, ingredients, categories } = req.body;
        const { id } = req.params;
        const updateRecipe = db.prepare('UPDATE Recipes SET name = ?, instructions = ?, pictureUrl = ?, preparationTime = ?, calories = ?, protein = ?, carbs = ?, fat = ? WHERE id = ?');
        updateRecipe.run(name, instructions, pictureUrl, preparationTime, calories, protein, carbs, fat, id, function(err) {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          db.run('DELETE FROM RecipeIngredients WHERE recipeId = ?', id, function(err) {
            if (err) {
              res.status(500).json({ error: err.message });
              return;
            }
            const insertIngredient = db.prepare('INSERT INTO RecipeIngredients (recipeId, ingredientId, quantity) VALUES (?, ?, ?)');
            ingredients.forEach(ingredient => {
              insertIngredient.run(id, ingredient.ingredientId, ingredient.quantity);
            });
            insertIngredient.finalize();
    
            db.run('DELETE FROM RecipeCategories WHERE recipeId = ?', id, function(err) {
              if (err) {
                res.status(500).json({ error: err.message });
                return;
              }
              const insertCategory = db.prepare('INSERT INTO RecipeCategories (recipeId, categoryId) VALUES (?, ?)');
              categories.forEach(categoryId => {
                insertCategory.run(id, categoryId);
              });
              insertCategory.finalize();
    
              res.json({ changes: this.changes });
            });
          });
        });
    });
  
    router.delete('/:id', (req, res) => {
        const { id } = req.params;
        const deleteRecipe = db.prepare('DELETE FROM Recipes WHERE id = ?');
        deleteRecipe.run(id, function(err) {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          db.run('DELETE FROM RecipeIngredients WHERE recipeId = ?', id, function(err) {
            if (err) {
              res.status(500).json({ error: err.message });
              return;
            }
            db.run('DELETE FROM RecipeCategories WHERE recipeId = ?', id, function(err) {
              if (err) {
                res.status(500).json({ error: err.message });
                return;
              }
              res.json({ changes: this.changes });
            });
          });
        });
    });
  
    return router;
};
