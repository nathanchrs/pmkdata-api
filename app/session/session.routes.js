'use strict';

var express = require('express');
var passport = require('../components/passport.js');
var auth = require('../components/auth.js');
var validators = require('./session.validators.js');

var router = express.Router();

/* Get current user */

router.get('/session', auth.isLoggedIn, (req, res) => {
  return res.json(req.user);
});

/* Login */

router.post('/session', validators.createSession, passport.authenticate('local'), (req, res) => {
  return res.json(req.user);
});

/* Logout */

router.delete('/session', (req, res) => {
  req.logout();
  return res.json({ 'message': 'Logged out successfully.' });
});

module.exports = router;
