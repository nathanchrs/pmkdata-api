'use strict';

const knexCleaner = require('knex-cleaner');
const knex = require('../app/common/knex');

before(async () => {
  console.log('Cleaning test DB before starting tests...');
  await knexCleaner.clean(knex);
  await knex.migrate.latest();
  console.log('Test DB cleaned.');
});

after(() => {
  knex.destroy();
});
