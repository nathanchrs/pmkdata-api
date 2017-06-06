'use strict';

var express = require('express');

var router = express.Router();

router.get('/', function (req, res) {
  return res.json({ hello: 'world' });
});

module.exports = router;
