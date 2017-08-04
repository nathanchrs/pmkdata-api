'use strict';

var knex = require('../components/knex.js');

module.exports = {
  listInteractions: (search, page, perPage, sort) => {
    return knex.select('id', 'time', 'notes', 'created_at', 'updated_at')
      .from('interactions')
      .search(search, ['id', 'time', 'notes'])
      .pageAndSort(page, perPage, sort, ['id', 'time', 'notes']);
  },

  createInteraction: (newInteraction) => {
    return knex('interactions').insert(newInteraction);
  },

  getInteraction: (id) => {
    return knex.select('id', 'time', 'notes', 'created_at', 'updated_at')
      .from('interactions')
      .where('id', id)
      .first();
  },

  updateInteraction: (id, eventUpdates) => {
    return knex('interactions').update(eventUpdates).where('id', id);
  },

  deleteInteraction: (id) => {
    return knex('interactions').delete().where('id', id);
  }

};
