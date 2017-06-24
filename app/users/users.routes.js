'use strict';

const express = require('express');
const knex = require('../components/knex.js');
const auth = require('../components/auth.js');
const validators = require('./users.validators.js');
const errors = require('http-errors');

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

module.exports = router;
