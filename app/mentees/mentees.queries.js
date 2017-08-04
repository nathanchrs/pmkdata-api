'use strict';

var knex = require('../components/knex.js');

module.exports = {
  listMentees: (search, page, perPage, sort) => {
    return knex.select('id', 'mentor_id', 'mentee_id', 'notes', 'created_at', 'updated_at')
      .from('mentees')
      .search(search, ['id', 'mentor_id', 'mentee_id', 'notes'])
      .pageAndSort(page, perPage, sort, ['id', 'mentor_id', 'mentee_id', 'notes']);
  },

  createMentee: (newMentee) => {
    return knex('mentees').insert(newMentee);
  },

  getMentee: (id) => {
    return knex.select('id', 'mentor_id', 'mentee_id', 'notes', 'created_at', 'updated_at')
      .from('mentees')
      .where('id', id)
      .first();
  },

  updateMentee: (id, menteeUpdates) => {
    return knex('mentees').update(menteeUpdates).where('id', id);
  },

  deleteMentee: (id) => {
    return knex('mentees').delete().where('id', id);
  }

};
