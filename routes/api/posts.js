const router = require('express').Router();
const db = require('../../db');

router.get('/', (req, res) => {
    db.sequelize.query('SELECT NOW()', {type: db.sequelize.QueryTypes.select})
        .then(dbres => {
            res.send(dbres[0][0].now);
        });
});

module.exports = router;