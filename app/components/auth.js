'use strict';

/**
 * Contains custom [Express](https://expressjs.com/) middleware for authentication and authorization.
 * @module app/components/auth
 */

const _ = require('lodash');
const errors = require('http-errors');

function createAuthMiddleware (roles) {
  if (typeof roles === 'string') roles = [roles];
  return function (req, res, next) {
    if (!req.user) return next(new errors.Unauthorized());
    if (!_.includes(roles, req.user.role)) return next(new errors.Forbidden());
    return next();
  };
}

/* Common middleware for authorization check */

module.exports = {

  /**
   * Middleware that checks whether the user is logged in. Throws a HTTP Unauthorized (401) error otherwise.
   */
  isLoggedIn: (req, res, next) => {
    if (!req.user) return next(new errors.Unauthorized('Not logged in.'));
    return next();
  },

  /**
   * Middleware that checks whether the user is an admin.
   */
  isAdmin: createAuthMiddleware('admin'),

  /**
   * Middleware that checks whether the user is a supervisor.
   */
  isSupervisor: createAuthMiddleware(['admin', 'supervisor'])
};
