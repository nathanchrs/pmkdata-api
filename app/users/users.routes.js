'use strict';

const express = require('express');
const knex = require('../components/knex.js');
const auth = require('../components/auth.js');
const validators = require('./users.validators.js');
const errors = require('http-errors');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const bcryptStrength = 8;
const router = express.Router();

/** Custom auth middleware that checks whether the accessing user is this user's owner or a supervisor. */
// TODO: refactor duplicate auth definitions
const isOwnerOrSupervisor = (req, res, next) => {
  if (!req.user) return next(new errors.Unauthorized());
  if (req.user.username !== req.params.username) {
    if (!_.includes(['admin', 'supervisor'], req.user.role)) return next(new errors.Forbidden());
  }
  return next();
};

function ensureOldPasswordIsCorrect (username, password) {
  return knex.first('username', 'password').from('users').where('username', username)
    .then(function (user) {
      if (!user) throw new errors.Unauthorized('Wrong username or password.');
      return bcrypt.compare(password, user.password);
    })
    .then((res) => {
      if (!res) throw new errors.Unauthorized('Wrong username or password.');
      return Promise.resolve();
    });
}

/**
 * Get a list of users.
 * @name Get users
 * @route {GET} /users
 */
router.get('/users', auth.isSupervisor, validators.listUsers, (req, res, next) => {
  return knex.select('username', 'nim', 'email', 'role', 'status', 'created_at', 'updated_at')
    .from('users')
    .search(req.query.search, ['username', 'nim', 'email'])
    .pageAndSort(req.query.page, req.query.perPage, req.query.sort, ['username', 'nim', 'email', 'role', 'status', 'created_at', 'updated_at'])
    .then((result) => {
      return res.json(result);
    })
    .catch((err) => {
      return next(err);
    });
});

/**
 * Creates a new user.
 * @name Create user
 * @route {POST} /users
 */
router.post('/users', validators.createUser, (req, res, next) => { // TODO: email/captcha validation
  let newUser = _.pick(req.body, ['username', 'nim', 'email']);
  newUser.role = 'user';
  newUser.status = 'awaiting_validation';
  newUser.created_at = newUser.updated_at = new Date();

  let query = knex.select('username').from('users').where('username', req.body.username);
  if (req.body.nim) query = query.orWhere('nim', req.body.nim);

  query.first()
    .then((existingUsers) => {
      if (!_.isEmpty(existingUsers)) throw new errors.Conflict('Username already exists, or there is already a user for this NIM.');
      return bcrypt.hash(req.body.password, bcryptStrength);
    })
    .then((hash) => {
      newUser.password = hash;
      return knex('users').insert(newUser);
    })
    .then((insertedUsernames) => {
      return res.status(201).json(newUser);
    })
    .catch((err) => {
      return next(err);
    });
});

/**
 * Get specific user information for the specified username.
 * @name Get user info.
 * @route {GET} /users/:username
 */
router.get('/users/:username', isOwnerOrSupervisor, (req, res, next) => {
  return knex.select('username', 'nim', 'email', 'role', 'status', 'created_at', 'updated_at')
    .from('users')
    .where('username', req.params.username)
    .first()
    .then((user) => {
      if (!user) return next(new errors.NotFound('User not found.'));
      console.log(user);
      return res.json(user);
    })
    .catch((err) => {
      return next(err);
    });
});

/**
 * Updates user information for the given username.
 * @name Update user
 * @route {PATCH} /users/:username
 */
router.patch('/users/:username', isOwnerOrSupervisor, validators.updateUser, (req, res, next) => {
  let userUpdate = {
    email: req.body.email,
    updated_at: new Date()
  };

  let promises = Promise.resolve(undefined);

  // Supervisor can update all and don't need old password check, owner can't update status, role, NIM
  // TODO: refactor duplicate auth definitions
  if (_.includes(['admin', 'supervisor'], req.user.role)) {
    userUpdate.nim = req.body.nim;
    userUpdate.status = req.body.status;
    userUpdate.role = req.body.role;
  } else if (req.body.newPassword) {
    promises = promises.then(() => {
      return ensureOldPasswordIsCorrect(req.body.oldPassword); // Old password check
    });
  }

  if (req.body.newPassword) {
    promises = promises.then(() => {
      return bcrypt.hash(req.body.password, bcryptStrength);
    });
  }

  promises
    .then((hash) => {
      userUpdate.password = hash; // If hash is not computed, will result in undefined, which will be ignored.
      return knex('users').update(userUpdate).where('username', req.params.username);
    })
    .then((affectedRowCount) => {
      return res.json({ affectedRowCount: affectedRowCount });
    })
    .catch((err) => {
      return next(err);
    });
});

/**
 * Delete the specified user.
 * @name Delete user
 * @route {DELETE} /users/:username
 */
router.delete('/users/:username', auth.isSupervisor, (req, res, next) => {
  return knex('users').delete().where('username', req.params.username)
    .then((affectedRowCount) => {
      return res.json({ affectedRowCount: affectedRowCount });
    })
    .catch((err) => {
      return next(err);
    });
});

module.exports = router;
