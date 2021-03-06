'use strict';

/**
 * @module app/common/passport
 */

const passport = require('passport');
const LocalStrategy = require('passport-local');
const knex = require('./knex');
const bcrypt = require('bcryptjs');
const errors = require('http-errors');
const { userStatus } = require('../common/constants');

const userColumns = ['username', 'nim', 'email', 'password', 'status', 'created_at', 'updated_at'];
const userColumnsWithoutPassword = userColumns.filter(column => column !== 'password');

passport.use(new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password'
  },
  (username, password, done) => {
    knex.first(userColumns).from('users').where('username', username)
      .then(function (user) {
        if (!user) {
          return done(new errors.Unauthorized('Wrong username or password.'));
        }
        bcrypt.compare(password, user.password, function (err, res) {
          delete user.password;
          if (err) return done(err);
          if (!res) return done(new errors.Unauthorized('Wrong username or password.'));
          if (!user || user.status !== userStatus.ACTIVE) return done(new errors.Unauthorized('Account inactive.'));
          return done(null, user);
        });
      })
      .catch(done);
  })
);

passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser((username, done) => {
  knex.first(userColumnsWithoutPassword).from('users').where('username', username)
    .then(function (user) {
      done(null, user);
    })
    .catch(done);
});

/** A [Passport](http://passportjs.org/) instance set up to use a local authentication strategy (with local username/password). */
module.exports = passport;
