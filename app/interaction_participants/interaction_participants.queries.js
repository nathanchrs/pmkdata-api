'use strict';

var knex = require('../components/knex.js');

module.exports = {
  listInteractionParticipants: (search, page, perPage, sort) => {
    return knex.select('id', 'mentor_id', 'mentee_id', 'notes', 'created_at', 'updated_at')
      .from('interaction_participants')
      .search(search, ['id', 'mentor_id', 'mentee_id', 'notes'])
      .pageAndSort(page, perPage, sort, ['id', 'mentor_id', 'mentee_id', 'notes']);
  },

  createInteractionParticipant: (newInteractionParticipant) => {
    return knex('interaction_participants').insert(newInteractionParticipant);
  },

  getInteractionParticipant: (id) => {
    return knex.select('id', 'mentor_id', 'mentee_id', 'notes', 'created_at', 'updated_at')
      .from('interaction_participants')
      .where('id', id)
      .first();
  },

  updateInteractionParticipant: (id, menteeUpdates) => {
    return knex('interaction_participants').update(menteeUpdates).where('id', id);
  },

  deleteInteractionParticipant: (id) => {
    return knex('interaction_participants').delete().where('id', id);
  }

};
