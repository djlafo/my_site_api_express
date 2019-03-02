const router = require('express').Router();
const db = require('../../db');
const auth = require('../../auth');

router.post('/', auth.required, (req, res, next) => {
    return res.json({success: true});
});

module.exports = router;