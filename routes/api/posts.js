const router = require('express').Router();
const auth = require('../../auth');

router.get('/', (req, res, next) => {
    return res.json({success: true});
});

router.post('/', auth.required, (req, res, next) => {
    return res.send('not yet');
});

module.exports = router;