const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { setupDatabase } = require('./db/setup');
const seedDatabase = require('./data/seed');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '25mb' }));
app.use(bodyParser.urlencoded({ limit: '25mb', extended: true }));

// Setup database and seed initial data
const dbPath = path.join(__dirname, 'recipes.db');
const db = setupDatabase(dbPath);
seedDatabase(db);

// Routes
const recipeRoutes = require('./routes/recipes')(db);
const ingredientRoutes = require('./routes/ingredients')(db);
const categoryRoutes = require('./routes/categories')(db);
const favoriteRoutes = require('./routes/favorites')(db);

app.use('/recipes', recipeRoutes);
app.use('/ingredients', ingredientRoutes);
app.use('/categories', categoryRoutes);
app.use('/favorites', favoriteRoutes);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

module.exports = db;
