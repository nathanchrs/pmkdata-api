'use strict';

const express = require('express');
const auth = require('../components/auth.js');
const errors = require('http-errors');
const _ = require('lodash');
const queries = require('./interaction_participants.queries');
const validators = require('./interaction_participants.validators');

const router = express.Router();

/**
 * Get a list of interaction_participants.
 * @name Get interaction_participants
 * @route {GET} /interaction_participants
 */
router.get('/interaction_participants', auth.middleware.isSupervisor, validators.listInteractionParticipants, (req, res, next) => {
  return queries.listInteractionParticipants(req.query.search, req.query.page, req.query.perPage, req.query.sort)
    .then((result) => {
      return res.json(result);
    })
    .catch(next);
});

/**
 * Creates a new interactionParticipant
 * @name Create interactionParticipant
 * @route {POST} /interaction_participants
 */
router.post('/interaction_participants', validators.createInteractionParticipant, (req, res, next) => {
  let newInteractionParticipant = _.pick(req.body, ['mentor_id', 'mentee_id', 'notes']);
  newInteractionParticipant.created_at = newInteractionParticipant.updated_at = new Date();

  return queries.createInteractionParticipant(newInteractionParticipant)
    .then((insertedId) => {
      let insertedInteractionParticipant = newInteractionParticipant;
      insertedInteractionParticipant['id'] = insertedId;
      return res.status(201).json(insertedInteractionParticipant);
    })
    .catch(next);
});

/**
 * Get specific interactionParticipant information for the given id.
 * @name Get interactionParticipant info
 * @route {GET} /interaction_participants/:id
 */
router.get('/interaction_participants/:id', auth.middleware.isSupervisor, (req, res, next) => {
  return queries.getInteractionParticipant(req.params.id)
    .then((interactionParticipant) => {
      if (!interactionParticipant) return next(new errors.NotFound('Interaction participants not found. '));
      return res.json(interactionParticipant);
    })
    .catch(next);
});

/**
 * Updates interactionParticipant information for the given id.
 * @name Update interactionParticipant
 * @route {PATCH} /interaction_participants/:id
 */
router.patch('/interaction_participants/:id', auth.middleware.isSupervisor, validators.updateInteractionParticipant, (req, res, next) => {
  let interactionParticipantUpdates = _.pick(req.body, ['mentor_id', 'mentee_id', 'notes']);
  interactionParticipantUpdates.updated_at = new Date();

  return queries.updateInteractionParticipant(req.params.id, interactionParticipantUpdates)
    .then((affectedRowCount) => {
      return res.json({ affectedRowCount: affectedRowCount });
    })
    .catch(next);
});

/**
 * Delete the specified interactionParticipant.
 * @name Delete interactionParticipant
 * @route {DELETE} /interaction_participants/:id
 */
router.delete('/interaction_participants/:id', auth.middleware.isSupervisor, (req, res, next) => {
  return queries.deleteInteractionParticipant(req.params.id)
    .then((affectedRowCount) => {
      return res.json({ affectedRowCount: affectedRowCount });
    })
    .catch(next);
});

module.exports = router;
