'use strict';

const express = require('express');
const knex = require('../components/knex.js');
const auth = require('../components/auth.js');
const validators = require('./users.validators.js');
const errors = require('http-errors');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const router = express.Router();

/**
 * Get a list of users.
 * @name Get users
 * @route {GET} /users
 */
router.get('/users', auth.isSupervisor, validators.listUsers, (req, res, next) => {
  return knex.select('username', 'nim', 'email', 'role', 'created_at', 'updated_at')
    .from('users')
    .search(req.query.search, ['username', 'nim', 'email'])
    .pageAndSort(req.query.page, req.query.perPage, req.query.sort, ['username', 'nim', 'email', 'role', 'created_at', 'updated_at'])
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
router.post('/users', auth.isLoggedIn, validators.createUser, (req, res, next) => {
  let newUser = _.pick(req.body, ['username', 'nim', 'email']);
  newUser.role = 'user';
  newUser.created_at = newUser.updated_at = new Date();

  let query = knex.select('username').from('users').where('username', req.body.username);
  if (req.body.nim) query = query.orWhere('nim', req.body.nim);

  query.first()
    .then((existingUsers) => {
      if (!_.isEmpty(existingUsers)) throw new errors.Conflict('Username already exists, or there is already a user for this NIM.');

      const strength = 8;
      return bcrypt.hash(req.input.password, strength);
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
router.get('/users/:username', auth.isLoggedIn, (req, res, next) => {
  return knex.select('username', 'nim', 'email', 'role', 'created_at', 'updated_at')
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
router.patch('/users/:username', auth.isSupervisor, validators.updateUser, (req, res, next) => { // TODO: owner auth
  const userUpdate = {
    'nim': req.body.nim,
    'email': req.body.email,
    'updated_at': new Date()
  };

  return knex('users').update(userUpdate).where('username', req.params.username)
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
