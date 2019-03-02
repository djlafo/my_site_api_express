const router = require('express').Router();
const db = require('../../db');
const Users = db.sequelize.import('../../models/users');
const passport = require('passport');

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {session: false}, function(err, user, info) {
        if(err) {
            return next(err);
        } else if(user) {
            const serialized = Users.serializeUser(user);
            serialized.token = Users.generateUserJWT(user);
            return res.json({user: serialized});
        } else {
            return res.status(422).json(info);
        }
    })(req, res,next);
});

module.exports = router;