function seedDatabase(db) {
    db.serialize(() => {
      db.get('SELECT COUNT(*) as count FROM Recipes', (err, row) => {
        if (err) {
          console.error('Error checking Recipes count:', err);
          return;
        }
        if (row.count === 0) {
          const insertStmt = db.prepare(`INSERT INTO Recipes (name, ingredients, instructions, pictureUrl, calories, protein, carbs, fat) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
          const recipes = [
            {
              name: 'Spaghetti Carbonara',
              ingredients: 'Spaghetti, Eggs, Parmesan, Bacon',
              instructions: 'Cook spaghetti. Mix eggs and parmesan. Fry bacon. Combine all.',
              pictureUrl: 'https://cdn.aniagotuje.com/pictures/articles/2020/01/1967586-v-1080x1080.jpg',
              calories: 600,
              protein: 25,
              carbs: 75,
              fat: 20
            },
            {
              name: 'Chicken Curry',
              ingredients: 'Chicken, Curry Paste, Coconut Milk',
              instructions: 'Cook chicken. Add curry paste and coconut milk. Simmer.',
              pictureUrl: 'https://cdn.aniagotuje.com/pictures/articles/2020/01/1967553-v-1080x1080.jpg',
              calories: 500,
              protein: 30,
              carbs: 50,
              fat: 15
            },
            {
              name: 'Beef Stroganoff',
              ingredients: 'Beef, Onions, Mushrooms, Sour Cream',
              instructions: 'Cook beef. Add onions and mushrooms. Stir in sour cream.',
              pictureUrl: 'https://cdn.aniagotuje.com/pictures/articles/2020/11/9751896-v-1080x1080.jpg',
              calories: 700,
              protein: 40,
              carbs: 60,
              fat: 25
            }
          ];
  
          recipes.forEach(recipe => {
            insertStmt.run(recipe.name, recipe.ingredients, recipe.instructions, recipe.pictureUrl, recipe.calories, recipe.protein, recipe.carbs, recipe.fat);
          });
  
          insertStmt.finalize();
        }
      });
    });
}
  
module.exports = seedDatabase;
