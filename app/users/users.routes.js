'use strict';

const express = require('express');
const _ = require('lodash');
const auth = require('../components/auth.js');
const validators = require('./users.validators.js');
const errors = require('http-errors');
const queries = require('./users.queries.js');
const config = require('config');
const { userStatus } = require('../common/constants.js');

const router = express.Router();

/**
 * Check whether the current user is accessing itself.
 */
function checkOwner (req) {
  return req.user.username === req.params.username;
}

/**
 * Get a list of users.
 * @name List users
 * @route {GET} /users
 */
router.get('/users', auth.requirePrivilege('list-users'), validators.listUsers, async (req, res, next) => {
  const result = await queries.listUsers(req.query.search, req.query.page, req.query.perPage, req.query.sort);
  return res.json(result);
});

/**
 * Get a list of users for searching.
 * @name Search users
 * @route {GET} /users/search
 */
router.get('/users/search', auth.requirePrivilege('search-users'), async (req, res, next) => {
  const result = await queries.searchUsers(req.query.search);
  return res.json(result);
});

/**
 * Creates a new user (login required, for admins, etc.).
 * @name Create user
 * @route {POST} /users
 */
router.post('/users', auth.requirePrivilege('create-user'), validators.createUser, async (req, res, next) => {
  const insertedUser = await queries.createUser(req.body);
  // TODO: add default role for the new user in the 'user_roles' table.
  return res.status(201).json(insertedUser);
});

/**
 * Public (no login required) endpoint for creating a new user (for registration, etc.).
 * Sets the new user's status to 'awaiting_validation'.
 * Can be accessed if publicUserRegistration config is true.
 * TODO: email/captcha validation
 * @name Public user registration
 * @route {POST} /users/public
 */
router.post('/users/public', validators.createUser, async (req, res, next) => {
  const publicUserRegistration = config.get('publicUserRegistration');
  if (!publicUserRegistration) throw new errors.Forbidden('Public user registration is not available at the moment.');

  req.body.status = userStatus.AWAITING_VALIDATION;
  const insertedUser = await queries.createUser(req.body);
  return res.status(201).json(insertedUser);
});

/**
 * Get specific user information for the specified username.
 * @name View user
 * @route {GET} /users/:username
 */
router.get('/users/:username', auth.requirePrivilege('view-user', checkOwner), async (req, res, next) => {
  const user = await queries.getUser(req.params.username);
  if (!user) throw new errors.NotFound('User not found.');
  return res.json(user);
});

/**
 * Updates user information for the given username.
 * TODO: verify status update to prevent locking out oneself.
 * @name Update user
 * @route {PATCH} /users/:username
 */
router.patch('/users/:username', auth.requirePrivilege('update-user', checkOwner), validators.updateUser, async (req, res, next) => {
  const affectedRowCount = await queries.updateUser(req.params.username, req.body);
  return res.json({ affectedRowCount });
});

/**
 * Updates user password for the given username.
 * If 'all' access modifier is not set, requires old password to be supplied.
 * @name Update user password
 * @route {PATCH} /users/:username/password
 */
router.patch('/users/:username/password', auth.requirePrivilege('update-user-password', checkOwner), validators.updateUserPassword, async (req, res, next) => {
  let affectedRowCount;
  if (_.includes(req.accessModifiers, auth.accessModifiers.ALL)) {
    affectedRowCount = await queries.updateUserPassword(req.params.username, req.body.newPassword, false);
  } else {
    affectedRowCount = await queries.updateUserPassword(req.params.username, req.body.newPassword, true, req.body.oldPassword);
  }
  return res.json({ affectedRowCount });
});

/**
 * Delete the specified user.
 * @name Delete user
 * @route {DELETE} /users/:username
 */
router.delete('/users/:username', auth.requirePrivilege('delete-user', checkOwner), async (req, res, next) => {
  const affectedRowCount = await queries.deleteUser(req.params.username);
  return res.json({ affectedRowCount });
});

/**
 * List the roles of this user.
 * @name List user roles
 * @route {GET} /users/:username/roles
 */
router.get('/users/:username/roles', auth.requirePrivilege('list-user-roles', checkOwner), async (req, res, next) => {
  const result = await queries.listUserRoles(req.params.username);
  return res.json(result);
});

/**
 * Add a role for this user
 * @name Create user role
 * @route {POST} /users/:username/roles
 */
router.post('/users/:username/roles', auth.requirePrivilege('create-user-role', checkOwner), validators.addUserRole, async (req, res, next) => {
  const insertedUserRole = await queries.addUserRole(req.params.username, req.body.role);
  return res.status(201).json(insertedUserRole);
});

/**
 * Remove a role from this user
 * @name Remove user role
 * @route {DELETE} /users/:username/roles/:role
 */
router.delete('/users/:username/roles/:role', auth.requirePrivilege('delete-user-role', checkOwner), async (req, res, next) => {
  const affectedRowCount = await queries.removeUserRole(req.params.username, req.params.role);
  return res.json({ affectedRowCount });
});

/**
 * List the privileges held by this user and the roles from which they are obtained from.
 * @name List user privileges
 * @route {GET} /users/:username/privileges
 */
router.get('/users/:username/privileges', auth.requirePrivilege('list-user-privileges', checkOwner), async (req, res, next) => {
  const result = await queries.listUserPrivileges(req.params.username);
  return res.json(result);
});

module.exports = router;
