const express = require('express');

module.exports = function(db) {
    const router = express.Router();

    router.post('/', (req, res) => {
        const { recipeId } = req.body;
        const insertFavorite = db.prepare('INSERT INTO Favorites (recipeId) VALUES (?)');
        insertFavorite.run(recipeId, function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID });
        });
    });

    router.delete('/:recipeId', (req, res) => {
        const { recipeId } = req.params;
        const deleteFavorite = db.prepare('DELETE FROM Favorites WHERE recipeId = ?');
        deleteFavorite.run(recipeId, function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ changes: this.changes });
        });
    });

    return router;
};
