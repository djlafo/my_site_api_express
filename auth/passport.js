const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Users = require('../db').sequelize.models.Users;

passport.use(new LocalStrategy({
  usernameField: 'user[username]',
  passwordField: 'user[password]'
}, function(username, password, done) {
  Users.findOne({username: username}).then(function(user){
    if(!user || !user.isCorrectPassword(password)){
      return done(null, false, {errors: {'email or password': 'is invalid'}});
    }

    return done(null, user);
  }).catch(done);
}));

