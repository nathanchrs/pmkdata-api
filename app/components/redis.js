'use strict';

var redis = require('redis');
var config = require('config');

module.exports = redis.createClient(config.get('redis'));
