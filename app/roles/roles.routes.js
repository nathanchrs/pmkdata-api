'use strict';

const express = require('express');
const auth = require('../components/auth.js');
const validators = require('./roles.validators.js');
const queries = require('./roles.queries.js');

const router = express.Router();

/**
 * Get a list of roles available.
 * @name List roles
 * @route {GET} /roles
 */
router.get('/roles', auth.requirePrivilege('list-roles'), async (req, res, next) => {
  const result = await queries.listRoles();
  return res.json(result);
});

/**
 * Get a list of all privileges assigned to this role.
 * @name View role privileges
 * @route {GET} /roles/:role/privileges
 */
router.get('/roles/:role', auth.requirePrivilege('view-role-privileges'), async (req, res, next) => {
  const result = await queries.viewRolePrivileges(req.params.role);
  return res.json(result);
});

/**
 * Creates a privilege for a role.
 * @name Create role privilege
 * @route {POST} /roles/:role/privileges
 */
router.post('/roles/:role/privileges', auth.requirePrivilege('create-role-privilege'), validators.createRolePrivilege, async (req, res, next) => {
  const insertedRolePrivilege = await queries.createRolePrivilege(req.params.role, req.body.privilege);
  return res.status(201).json(insertedRolePrivilege);
});

/**
 * Delete the specified privilege from a role.
 * @name Delete role privilege
 * @route {DELETE} /roles/:role/privileges/:privilege
 */
router.delete('/roles/:role/privileges/:privilege', auth.requirePrivilege('delete-role-privilege'), async (req, res, next) => {
  const affectedRowCount = await queries.deleteRolePrivilege(req.params.role, req.params.privilege);
  return res.json({ affectedRowCount });
});

/**
 * List all privileges used in this app.
 * @name List available privileges
 * @route {POST} /available-privileges
 */
router.get('/available-privileges', auth.requirePrivilege('list-available-privileges'), async (req, res, next) => {
  return res.json(auth.availablePrivileges);
});

module.exports = router;
