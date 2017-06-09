'use strict';

var passport = require('passport');
var LocalStrategy = require('passport-local');
var knex = require('./knex.js');
var bcrypt = require('bcryptjs');
var errors = require('http-errors');

passport.use(new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password'
  },
  (username, password, done) => {
    knex.first('username', 'nim', 'email', 'password').from('users').where('username', username)
      .then(function (user) {
        if (!user) {
          return done(new errors.Unauthorized('Wrong username or password.'));
        }
        bcrypt.compare(password, user.password, function (err, res) {
          user.password = undefined;
          if (err) return done(err);
          if (!res) return done(new errors.Unauthorized('Wrong username or password.'));
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
  knex.first('username', 'nim', 'email').from('users').where('username', username)
    .then(function (user) {
      done(null, user);
    })
    .catch(function (err) {
      done(err);
    });
});

module.exports = passport;
