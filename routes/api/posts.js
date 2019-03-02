const router = require('express').Router();
const db = require('../../db');
// not sure why auth is making me specify index
const auth = require('../../auth/index');

router.post('/', auth.required, (req, res, next) => {
    return res.json({success: true});
});

module.exports = router;