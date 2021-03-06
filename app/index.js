'use strict';

/**
 * The application main module.
 * @module app/app
 */

console.log(':: pmkdata-api ::');
console.log('NODE_ENV: %s\n', process.env.NODE_ENV);

/* Load dependencies */

const listFiles = require('fs-readdir-recursive');
const path = require('path');
const config = require('config');
const express = require('express');
require('express-async-errors'); // Patch to support async/await error handling in Express
const errorHandler = require('api-error-handler');

/* Create app and logger */

var app = express();
global.appDirectory = __dirname;

/* Create the logger */

const winston = require('./common/winston');

/* Set up Express middleware */

winston.log('verbose', 'Setting up Express middleware...');

const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('./common/session');
const passport = require('./common/passport');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(session);
app.use(passport.initialize());
app.use(passport.session());

/* Load and apply routes */

winston.log('verbose', 'Loading and applying routes...');

const routeDirectory = global.appDirectory;
listFiles(routeDirectory).filter(file => file.endsWith('.routes.js')).forEach((file) => {
  const routerPath = path.join(routeDirectory, file);
  const router = require(routerPath);
  if (!router.baseRoute) router.baseRoute = '/';
  const completeRoute = config.get('routePrefix') + router.baseRoute;

  winston.log('verbose', 'Using route %s: %s...', file, completeRoute);
  app.use(completeRoute, router);
});

/* Apply Express error handler */

app.use(errorHandler());

/** The [Express](https://expressjs.com/) application object, ready to run. */
module.exports = app;
