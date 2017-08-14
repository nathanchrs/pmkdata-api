'use strict';

var knex = require('../components/knex.js');
const _ = require('lodash');

const eventColumns = ['name', 'description', 'created_at', 'updated_at'];
const eventAssignableColumns = ['name', 'description'];
const eventSearchableColumns = ['id', 'name', 'description'];
const eventSortableColumns = ['name', 'created_at', 'updated_at'];

module.exports = {
  listEvents: (search, page, perPage, sort) => {
    return knex.select(eventColumns)
      .from('events')
      .search(search, eventSearchableColumns)
      .pageAndSort(page, perPage, sort, eventSortableColumns);
  },

  createEvent: (newEvent) => {
    newEvent = _.pick(newEvent, eventAssignableColumns);
    newEvent.created_at = newEvent.updated_at = new Date();
    return knex('events').insert(newEvent).then(insertedId => Object.assign(newEvent, { id: insertedId }));
  },

  getEvent: (id) => {
    return knex.select(eventColumns)
      .from('events')
      .where('id', id)
      .first();
  },

  updateEvent: (id, eventUpdates) => {
    eventUpdates = _.pick(eventUpdates, eventAssignableColumns);
    eventUpdates.updated_at = new Date();
    return knex('events').update(eventUpdates).where('id', id);
  },

  deleteEvent: (id) => {
    return knex('events').delete().where('id', id);
  }

};
