const router = require('express').Router();
const passport = require('passport');

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {session: false}, function(err, user, info) {
        if(err) {
            return next(err);
        } else if(user) {
            return user.serialize(user).then((serialized) => {
                user.generateJWT().then(token => {
                    serialized.token = token;
                    return res.json({user: serialized});
                });
            });
        } else {
            return res.status(422).json(info);
        }
    })(req, res,next);
});

module.exports = router;