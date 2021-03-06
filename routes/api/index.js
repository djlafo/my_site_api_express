const router = require('express').Router();
const auth = require('../../auth');

router.use('/posts', require('./posts'));
router.use('/users', require('./users'));
router.use('/files', require('./files'));

router.get('/auth', auth.required, (err, res, next) => {
    res.json({status: 'authenticated'});
});

module.exports = router;