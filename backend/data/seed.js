function seedDatabase(db) {
    db.serialize(() => {
      db.get('SELECT COUNT(*) as count FROM Recipes', (err, row) => {
        if (err) {
          console.error('Error checking Recipes count:', err);
          return;
        }
        if (row.count === 0) {
            const insertRecipe = db.prepare(`INSERT INTO Recipes (name, instructions, pictureUrl, preparationTime, calories, protein, carbs, fat) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
            const recipes = [
              {
                name: 'Spaghetti Carbonara',
                instructions: 'Cook spaghetti. Mix eggs and parmesan. Fry bacon. Combine all.',
                pictureUrl: 'https://cdn.aniagotuje.com/pictures/articles/2020/01/1967586-v-1080x1080.jpg',
                preparationTime: 30,
                calories: 600,
                protein: 25,
                carbs: 75,
                fat: 20
              },
              {
                name: 'Chicken Curry',
                instructions: 'Cook chicken. Add curry paste and coconut milk. Simmer.',
                pictureUrl: 'https://cdn.aniagotuje.com/pictures/articles/2020/01/1967553-v-1080x1080.jpg',
                preparationTime: 45,
                calories: 500,
                protein: 30,
                carbs: 50,
                fat: 15
              },
              {
                name: 'Beef Stroganoff',
                instructions: 'Cook beef. Add onions and mushrooms. Stir in sour cream.',
                pictureUrl: 'https://cdn.aniagotuje.com/pictures/articles/2020/11/9751896-v-1080x1080.jpg',
                preparationTime: 40,
                calories: 700,
                protein: 40,
                carbs: 60,
                fat: 25
              }
            ];

            recipes.forEach(recipe => {
                insertRecipe.run(recipe.name, recipe.instructions, recipe.pictureUrl, recipe.preparationTime, recipe.calories, recipe.protein, recipe.carbs, recipe.fat);
            });
      
            insertRecipe.finalize();

            const insertIngredient = db.prepare(`INSERT INTO Ingredients (name, unit, iconUrl) VALUES (?, ?, ?)`);
            const ingredients = [
              { name: 'Spaghetti', unit: 'g', iconUrl: 'https://example.com/icons/spaghetti.png' },
              { name: 'Eggs', unit: 'pcs', iconUrl: 'https://example.com/icons/eggs.png' },
              { name: 'Parmesan', unit: 'g', iconUrl: 'https://example.com/icons/parmesan.png' },
              { name: 'Bacon', unit: 'g', iconUrl: 'https://example.com/icons/bacon.png' },
              { name: 'Chicken', unit: 'g', iconUrl: 'https://example.com/icons/chicken.png' },
              { name: 'Curry Paste', unit: 'g', iconUrl: 'https://example.com/icons/curry_paste.png' },
              { name: 'Coconut Milk', unit: 'ml', iconUrl: 'https://example.com/icons/coconut_milk.png' },
              { name: 'Beef', unit: 'g', iconUrl: 'https://example.com/icons/beef.png' },
              { name: 'Onions', unit: 'pcs', iconUrl: 'https://example.com/icons/onions.png' },
              { name: 'Mushrooms', unit: 'g', iconUrl: 'https://example.com/icons/mushrooms.png' },
              { name: 'Sour Cream', unit: 'ml', iconUrl: 'https://example.com/icons/sour_cream.png' }
            ];
    
            ingredients.forEach(ingredient => {
                insertIngredient.run(ingredient.name, ingredient.unit, ingredient.iconUrl);
            });
    
            insertIngredient.finalize();
        
            const insertCategory = db.prepare(`INSERT INTO Categories (name) VALUES (?)`);
            const categories = [
            'Breakfast',
            'Lunch',
            'Dinner',
            'Dessert',
            'Vegan',
            'Vegetarian',
            'Easy',
            'Medium',
            'Hard'
            ];

            categories.forEach(category => {
            insertCategory.run(category);
            });

            insertCategory.finalize();

            // Creating connections between recipes and ingredients
            const insertRecipeIngredient = db.prepare(`INSERT INTO RecipeIngredients (recipeId, ingredientId, quantity) VALUES (?, ?, ?)`);
            const recipeIngredients = [
            { recipeId: 1, ingredientId: 1, quantity: 200 },  // Spaghetti Carbonara - Spaghetti
            { recipeId: 1, ingredientId: 2, quantity: 2 },    // Spaghetti Carbonara - Eggs
            { recipeId: 1, ingredientId: 3, quantity: 100 },  // Spaghetti Carbonara - Parmesan
            { recipeId: 1, ingredientId: 4, quantity: 100 },  // Spaghetti Carbonara - Bacon
            { recipeId: 2, ingredientId: 5, quantity: 300 },  // Chicken Curry - Chicken
            { recipeId: 2, ingredientId: 6, quantity: 50 },   // Chicken Curry - Curry Paste
            { recipeId: 2, ingredientId: 7, quantity: 200 },  // Chicken Curry - Coconut Milk
            { recipeId: 3, ingredientId: 8, quantity: 300 },  // Beef Stroganoff - Beef
            { recipeId: 3, ingredientId: 9, quantity: 1 },    // Beef Stroganoff - Onions
            { recipeId: 3, ingredientId: 10, quantity: 100 }, // Beef Stroganoff - Mushrooms
            { recipeId: 3, ingredientId: 11, quantity: 200 }  // Beef Stroganoff - Sour Cream
            ];

            recipeIngredients.forEach(recipeIngredient => {
            insertRecipeIngredient.run(recipeIngredient.recipeId, recipeIngredient.ingredientId, recipeIngredient.quantity);
            });

            insertRecipeIngredient.finalize();

            // Creating connections between recipes and categories
            const insertRecipeCategory = db.prepare(`INSERT INTO RecipeCategories (recipeId, categoryId) VALUES (?, ?)`);
            const recipeCategories = [
            { recipeId: 1, categoryId: 2 },  // Spaghetti Carbonara - Lunch
            { recipeId: 1, categoryId: 8 },  // Spaghetti Carbonara - Medium
            { recipeId: 2, categoryId: 2 },  // Chicken Curry - Lunch
            { recipeId: 2, categoryId: 7 },  // Chicken Curry - Easy
            { recipeId: 3, categoryId: 3 },  // Beef Stroganoff - Dinner
            { recipeId: 3, categoryId: 9 }   // Beef Stroganoff - Hard
            ];

            recipeCategories.forEach(recipeCategory => {
            insertRecipeCategory.run(recipeCategory.recipeId, recipeCategory.categoryId);
            });

            insertRecipeCategory.finalize();
        }
      });
    });
}
  
module.exports = seedDatabase;
