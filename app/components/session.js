'use strict';

var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var config = require('config');
var redisClient = require('./redis.js');
var sessionStore = new RedisStore({ client: redisClient, prefix: 'pmkdata:session:' });

module.exports = session({
  resave: false,
  saveUninitialized: false,
  secret: config.get('secret'),
  store: sessionStore
});
