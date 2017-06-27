'use strict';

/**
 * @module app/components/passport
 */

const passport = require('passport');
const LocalStrategy = require('passport-local');
const knex = require('./knex.js');
const bcrypt = require('bcryptjs');
const errors = require('http-errors');

passport.use(new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password'
  },
  (username, password, done) => {
    knex.first('username', 'nim', 'email', 'password', 'role', 'status').from('users').where('username', username)
      .then(function (user) {
        if (!user) {
          return done(new errors.Unauthorized('Wrong username or password.'));
        }
        bcrypt.compare(password, user.password, function (err, res) {
          user.password = undefined;
          if (err) return done(err);
          if (!res) return done(new errors.Unauthorized('Wrong username or password.'));
          if (user.status !== 'active') return done(new errors.Unauthorized('Account inactive.'));
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
  knex.first('username', 'nim', 'email', 'role', 'status').from('users').where('username', username)
    .then(function (user) {
      done(null, user);
    })
    .catch(function (err) {
      done(err);
    });
});

/** A [Passport](http://passportjs.org/) instance set up to use a local authentication strategy (with local username/password). */
module.exports = passport;
