'use strict';

const express = require('express');
const knex = require('../components/knex.js');
const auth = require('../components/auth.js');
const validators = require('./users.validators.js');

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

module.exports = router;
