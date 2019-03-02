const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../db');
const Users = db.sequelize.import('../models/users');

passport.use(new LocalStrategy({
  usernameField: 'user[username]',
  passwordField: 'user[password]'
}, function(username, password, done) {
  Users.findOne({username: username}).then(function(user){
    if(!user || !Users.isCorrectPassword(password, user.salt, user.hash)){
      return done(null, false, {errors: {'email or password': 'is invalid'}});
    }

    return done(null, user);
  }).catch(done);
}));

