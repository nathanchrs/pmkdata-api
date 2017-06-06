'use strict';

var passport = require('passport');
var LocalStrategy = require('passport-local');
var knex = require('./knex.js');
var bcrypt = require('bcryptjs');

passport.use(new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password'
  },
  (username, password, done) => {
    knex.first('username', 'name', 'email', 'password').from('users').where('username', username)
      .then(function (user) {
        if (!user) {
          return done(null, false, { message: 'Wrong username or password.' });
        }
        bcrypt.compare(password, user.password, function (err, res) {
          if (err) return done(err);
          if (!res) return done(null, false, { message: 'Wrong username or password.' });
          return done(null, user);
        });
      })
      .catch(function (err) {
        return done(err);
      });
  })
);

passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser((username, done) => {
  knex.first('username', 'name', 'email', 'password').from('users').where('username', username)
    .then(function (user) {
      done(null, user);
    })
    .catch(function (err) {
      done(err);
    });
});

module.exports = passport;
