'use strict';

/**
 * An instance of [Knex](http://knexjs.org/), extended with custom methods.
 * Note: the method used to extend Knex below is a temporary workaround
 * until Knex provides a proper way to extend QueryBuilder.
 * See [this issue](https://github.com/tgriesser/knex/issues/1158)
 * (the workaround recommended there does not work starting from 0.12.0).
 * @module app/common/knex
 */

const Knex = require('knex');
const config = require('config');

const knex = Knex(config.get('knex'));

/** An instance of [Knex](http://knexjs.org/), initialized using the options in the `knex` section of the app configuration. */
module.exports = knex;
