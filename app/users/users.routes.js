'use strict';

const express = require('express');
const auth = require('../components/auth.js');
const validators = require('./users.validators.js');
const errors = require('http-errors');
const _ = require('lodash');
const queries = require('./users.queries.js');

const router = express.Router();

/** Custom auth middleware that checks whether the accessing user is this user's owner or a supervisor. */
const isOwnerOrSupervisor = auth.createMiddlewareFromPredicate((user, req) => {
  return (user.username === req.params.username) || auth.predicates.isSupervisor(user);
});

/**
 * Get a list of users.
 * @name Get users
 * @route {GET} /users
 */
router.get('/users', auth.middleware.isSupervisor, validators.listUsers, (req, res, next) => {
  return queries.listUsers(req.query.search, req.query.page, req.query.perPage, req.query.sort)
    .then((result) => {
      return res.json(result);
    })
    .catch(next);
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

  return queries.createUser(newUser)
    .then((insertedUsernames) => {
      return res.status(201).json(newUser);
    })
    .catch(next);
});

/**
 * Get specific user information for the specified username.
 * @name Get user info.
 * @route {GET} /users/:username
 */
router.get('/users/:username', isOwnerOrSupervisor, (req, res, next) => {
  return queries.getUser(req.params.username)
    .then((user) => {
      if (!user) return next(new errors.NotFound('User not found.'));
      return res.json(user);
    })
    .catch(next);
});

/**
 * Updates user information for the given username.
 * @name Update user
 * @route {PATCH} /users/:username
 */
router.patch('/users/:username', isOwnerOrSupervisor, validators.updateUser, (req, res, next) => {
  let userUpdates = {
    email: req.body.email,
    password: req.body.newPassword,
    updated_at: new Date()
  };

  // Supervisor can update all and don't need old password check for password changes, owner can't update status, role, NIM
  let requireOldPasswordCheck = true;
  if (auth.predicates.isSupervisor(req.user)) {
    userUpdates.nim = req.body.nim;
    userUpdates.status = req.body.status;
    userUpdates.role = req.body.role;
    requireOldPasswordCheck = false;
  }

  return queries.updateUser(req.params.username, userUpdates, requireOldPasswordCheck, req.body.oldPassword)
    .then((affectedRowCount) => {
      return res.json({ affectedRowCount: affectedRowCount });
    })
    .catch(next);
});

/**
 * Delete the specified user.
 * @name Delete user
 * @route {DELETE} /users/:username
 */
router.delete('/users/:username', auth.middleware.isSupervisor, (req, res, next) => {
  return queries.deleteUser(req.params.username)
    .then((affectedRowCount) => {
      return res.json({ affectedRowCount: affectedRowCount });
    })
    .catch(next);
});

module.exports = router;
