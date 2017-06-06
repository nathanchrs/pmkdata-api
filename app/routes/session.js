'use strict';

var express = require('express');
var passport = require('../components/passport.js');
var auth = require('../components/auth.js');
var router = express.Router();

router.get('/session', auth.isLoggedIn, (req, res) => {
  return res.json(req.user);
});

router.post('/session', passport.authenticate('local'), (req, res) => {
  return res.json(req.user);
});

router.delete('/session', (req, res) => {
  req.logout();
  return res.json({ 'message': 'Logged out successfully.' });
});

module.exports = router;
