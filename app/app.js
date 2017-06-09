'use strict';

console.log(':: pmkdata-api ::');
console.log('NODE_ENV: %s\n', process.env.NODE_ENV);

/* Load dependencies */

var listFiles = require('fs-readdir-recursive');
var path = require('path');
var config = require('config');
var express = require('express');

/* Create app and logger */

var app = express();
global.appDirectory = __dirname;
var winston = require('./components/winston.js');

/* Set up Express middleware */

winston.log('verbose', 'Setting up Express middleware...');

var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('./components/session.js');
var passport = require('./components/passport.js');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(session);
app.use(passport.initialize());
app.use(passport.session());

/* Load and apply routes */

winston.log('verbose', 'Loading and applying routes...');

var routeDirectory = global.appDirectory;
listFiles(routeDirectory).filter(file => file.endsWith('.routes.js')).forEach((file) => {
  var routerPath = path.join(routeDirectory, file);
  var router = require(routerPath);
  if (!router.baseRoute) router.baseRoute = '/';
  var completeRoute = config.get('routePrefix') + router.baseRoute;

  winston.log('verbose', 'Using route %s...', completeRoute);
  app.use(completeRoute, router);
});

/* Apply Express error and 404 handlers */
// TODO:
winston.log('warn', 'Still using default Express error handler, please implement custom error handlers');

/* Export the app */

module.exports = app;
