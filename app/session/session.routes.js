'use strict';

/**
 * @module app/users/routes
 */

const express = require('express');
const passport = require('../common/passport');
const auth = require('../common/auth');
const validators = require('./session.validators');

const router = express.Router();

/**
 * Get the current session information (currently only the current user).
 * @name View current session
 * @route {GET} /session
 */
router.get('/session', auth.isLoggedIn, async (req, res) => {
  return res.json(req.user);
});

/**
 * @name Create new session (login)
 * @route {POST} /session
 * @bodyparam username {string} The user's username.
 * @bodyparam password {string} The password entered.
 * @return {object} The current user information if login is successful, HTTP 401 otherwise.
 */
router.post('/session', validators.createSession, passport.authenticate('local'), async (req, res) => {
  return res.json(req.user);
});

/**
 * @name Delete current session (logout)
 * @route {DELETE} /session
 */
router.delete('/session', async (req, res) => {
  req.logout();
  return res.json({ 'message': 'Logged out successfully.' });
});

module.exports = router;
