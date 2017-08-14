'use strict';

var knex = require('../components/knex.js');

const _ = require('lodash');

const interactionColumns = ['id', 'time', 'title', 'notes', 'tags', 'created_at', 'updated_at'];
const interactionAssignableColumns = ['time', 'title', 'notes', 'tags'];
const interactionSearchableColumns = ['id', 'time', 'title', 'notes', 'tags'];
const interactionSortableColumns = ['id', 'time', 'title', 'tags', 'created_at', 'updated_at'];

// const interactionMentorColumns = ['id', 'interaction_id', 'user_id', 'created_at', 'updated_at'];
// const interactionParticipantColumns = ['id', 'interaction_id', 'user_id', 'created_at', 'updated_at'];

module.exports = {
  isInteractionMentor: (interactionId, userId) => {
    knex.select('id')
      .from('interaction_mentors')
      .where('interaction_id', interactionId)
      .andWhere('user_id', userId)
      .first()
      .then(interactionMentor => !!interactionMentor);
  },

  listInteractions: (search, page, perPage, sort, filterByMentorId) => {
    let query = knex.select(interactionColumns).from('interactions');

    if (filterByMentorId) {
      query = query.leftJoin('interaction_mentors', 'interaction.id', 'interaction_mentors.interaction_id')
        .where('interaction_mentors.user_id', filterByMentorId);
    }

    return query
      .search(search, interactionSearchableColumns)
      .pageAndSort(page, perPage, sort, interactionSortableColumns);
  },

  createInteraction: (newInteraction) => {
    newInteraction = _.pick(newInteraction, interactionAssignableColumns);
    newInteraction.created_at = newInteraction.updated_at = new Date();
    return knex('interactions').insert(newInteraction).then(insertedId => Object.assign(newInteraction, { id: insertedId }));
  },

  getInteraction: (id, filterByMentorId) => {
    return knex.select(interactionColumns)
      .from('interactions')
      .where('interactions.id', id)
      .first();
  },

  updateInteraction: (id, interactionUpdates) => {
    interactionUpdates = _.pick(interactionUpdates, interactionAssignableColumns);
    interactionUpdates.updated_at = new Date();
    return knex('interactions').update(interactionUpdates).where('id', id);
  },

  deleteInteraction: (id) => {
    return knex('interactions').delete().where('id', id);
  }

};
