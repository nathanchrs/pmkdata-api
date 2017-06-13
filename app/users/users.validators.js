'use strict';

const _ = require('lodash');
const validation = require('../components/validation.js');

const schemas = {

  

};

module.exports = _.mapValues(schemas, validation.createValidator);
