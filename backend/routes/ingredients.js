const express = require('express');

module.exports = function(db) {
    const router = express.Router();

    router.get('/', (req, res) => {
        db.all('SELECT * FROM Ingredients', [], (err, ingredients) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ ingredients });
        });
    });

    return router;
};
