'use strict';

const express = require('express');
const auth = require('../components/auth.js');
const validators = require('./users.validators.js');

const router = express.Router();

/* Get list of users */

router.get('/users', auth.isSupervisor, (req, res, next) => {

});

module.exports = router;
