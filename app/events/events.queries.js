'use strict';

var knex = require('../components/knex.js');

module.exports = {
  listEvents: (search, page, perPage, sort) => {
    return knex.select('id', 'name', 'description', 'created_at', 'updated_at')
      .from('events')
      .search(search, ['id', 'name', 'description'])
      .pageAndSort(page, perPage, sort, ['id', 'name', 'description']);
  },

  createEvent: (newEvent) => {
    return knex('events').insert(newEvent);
  },

  getEvent: (id) => {
    return knex.select('id', 'name', 'description', 'created_at', 'updated_at')
      .from('events')
      .where('id', id)
      .first();
  },

  updateEvent: (id, eventUpdates) => {
    return knex('events').update(eventUpdates).where('id', id);
  },

  deleteEvent: (id) => {
    return knex('events').delete().where('id', id);
  }

};
