'use strict';

/**
 * Contains custom [Express](https://expressjs.com/) predicates and middleware for access control.
 * Each user has one or more role; each role has one or more privilege.
 * Each operation on a resource object can specify a privilege name to check against.
 * Privilege format: operation[:<accessModifier>]
 * An access modifier can be empty or 'owner'. 'owner' will cause the checkOwner function to be used.
 * An empty access modifier will is equal to the 'all' access modifier.
 * Examples:
 * - 'update-student' or 'update-student:all' can update all students.
 * - 'update-interaction:owner' can update interactions which are owned by the current user.
 * @module app/components/auth
 */

const errors = require('http-errors');
const _ = require('lodash');
const knex = require('./knex.js');
const winston = require('./winston.js');
const { userStatus } = require('../common/constants.js');

const privilegeDelimiter = ':';
const accessModifiers = { ALL: 'all', OWNER: 'owner' };

const getUserPrivileges = async user => {
  try {
    let results = await knex('users').distinct('privilege')
      .leftJoin('user_roles', 'users.username', 'user_roles.username')
      .leftJoin('role_privileges', 'user_roles.role', 'role_privileges.role')
      .where('username', user.username);
    return _.map(results, row => row.privilege);
  } catch (err) {
    return null;
  }
};

const predicates = {
  isActive: (user) => (user && user.status && user.status === userStatus.ACTIVE),
  isAwaitingValidation: (user) => (user && user.status && user.status === userStatus.AWAITING_VALIDATION),
  isDisabled: (user) => (user && user.status && user.status === userStatus.DISABLED)
};

/**
 * Creates an Express middleware that ensures the current user has the privilege given.
 * Then it checks whether the user has the given privilege.
 * If the current user (req.user) is not found or has no matching privilege, a HTTP Unauthorized (401) error is thrown.
 * Requires req.user.privileges to be loaded with an array of privileges of the current user.
 * Sets req.accessModifiers with a string array containing matching access modifiers (empty access modifier will be recorded as 'all').
 * @param operation {string} The operation name required by the current operation.
 * @param checkOwner {function} async (req) => Boolean: whether the current user should be able to do the operation in this request.
 *  If this function is not specified, the owner check won't be executed.
 * @returns An Express middleware that checks the given privilege.
 */
const requirePrivilege = (operation, checkOwner) => {
  return async (req, res, next) => {
    if (!req.user) throw new errors.Unauthorized(`Not logged in, can't access operation ${operation}.`);
    const userPrivileges = await getUserPrivileges(req.user);
    if (!userPrivileges) throw new errors.Unauthorized(`Can't list privileges for user {$req.user.username}.`);

    req.accessModifiers = [];
    const matchingUserPrivileges = _.filter(userPrivileges, p => (p === operation) || (p === operation + privilegeDelimiter));

    for (const userPrivilege in matchingUserPrivileges) {
      if (userPrivilege === operation) {
        req.accessModifiers.push(accessModifiers.ALL);
      } else if (userPrivilege === operation + privilegeDelimiter + accessModifiers.OWNER) {
        if (_.isFunction(checkOwner)) {
          if (await checkOwner(req)) {
            req.accessModifiers.push(accessModifiers.OWNER);
          }
        } else {
          winston.log('warn', `Operation ${operation} does not support 'owner' access modifier, or has wrong checkOwner function.`);
        }
      }
    }

    if (req.accessModifiers.length > 0) {
      winston.log('verbose', `Matching access modifiers ${req.accessModifiers} for operation ${operation} by user ${req.user.username}.`);
      return next();
    }
    throw new errors.Forbidden(`No matching privilege for operation ${operation} by user ${req.user.username}.`);
  };
};

/**
 * Express middleware that checks whether the user is logged in.
 * Throws a HTTP Unauthorized (401) error otherwise.
 */
const isLoggedIn = async (req, res, next) => {
  if (!req.user) throw new errors.Unauthorized('Not logged in.');
  return next();
};

module.exports = { accessModifiers, getUserPrivileges, predicates, requirePrivilege, isLoggedIn };
