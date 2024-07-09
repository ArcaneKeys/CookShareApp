const express = require('express');
const cors = require('cors');
const path = require('path');
const { setupDatabase } = require('./db/setup');
const seedDatabase = require('./data/seed');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Setup database and seed initial data
const dbPath = path.join(__dirname, 'recipes.db');
const db = setupDatabase(dbPath);
seedDatabase(db);

// Routes
const recipesRouter = require('./routes/recipes')(db);
app.use('/recipes', recipesRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

module.exports = db;
