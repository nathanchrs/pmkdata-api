'use strict';

var _ = require('lodash');
var errors = require('http-errors');

/* Common middleware for authorization check */

module.exports = {

  isLoggedIn: (req, res, next) => {
    if (!req.user) return next(new errors.Unauthorized('Not logged in.'));
    return next();
  },

  role: (roles) => {
    if (typeof roles === 'string') roles = [roles];
    return function (req, res, next) {
      if (!req.user) return next(new errors.NotAuthorized());
      if (!_.includes(roles, req.user.role)) return next(new errors.Forbidden());
      return next();
    };
  }

};
