'use strict';

const express = require('express');
const auth = require('../components/auth.js');
const errors = require('http-errors');
const _ = require('lodash');
const queries = require('./interactions.queries');
const validators = require('./interactions.validators');

const router = express.Router();

/**
 * Get a list of interactions.
 * @name Get interactions
 * @route {GET} /interactions
 */
router.get('/interactions', auth.middleware.isUser, validators.listInteractions, (req, res, next) => {
  return queries.listInteractions(req.query.search, req.query.page, req.query.perPage, req.query.sort)
    .then((result) => {
      return res.json(result);
    })
    .catch(next);
});

/**
 * Creates a new interaction
 * @name Create interaction
 * @route {POST} /interactions
 */
router.post('/interactions', auth.middleware.isUser, validators.createInteraction, (req, res, next) => {
  let newInteraction = _.pick(req.body, ['time', 'notes', 'tags']);
  newInteraction.created_at = newInteraction.updated_at = new Date();

  return queries.createInteraction(newInteraction)
    .then((insertedId) => {
      let insertedInteraction = newInteraction;
      insertedInteraction['id'] = insertedId;
      return res.status(201).json(insertedInteraction);
    })
    .catch(next);
});

/**
 * Get specific interaction information for the given id.
 * @name Get interaction info
 * @route {GET} /interactions/:id
 */
router.get('/interactions/:id', auth.middleware.isUser, (req, res, next) => {
  return queries.getInteraction(req.params.id)
    .then((interaction) => {
      if (!interaction) return next(new errors.NotFound('Interaction not found.'));
      return res.json(interaction);
    })
    .catch(next);
});

/**
 * Updates interaction information for the given id.
 * @name Update interaction
 * @route {PATCH} /interactions/:id
 */
router.patch('/interactions/:id', auth.middleware.isUser, validators.updateInteraction, (req, res, next) => {
  let interactionUpdates = _.pick(req.body, ['time', 'notes', 'tags']);
  interactionUpdates.time = new Date(interactionUpdates.time);
  interactionUpdates.updated_at = new Date();

  return queries.updateInteraction(req.params.id, interactionUpdates)
    .then((affectedRowCount) => {
      return res.json({ affectedRowCount: affectedRowCount });
    })
    .catch(next);
});

/**
 * Delete the specified interaction.
 * @name Delete interaction
 * @route {DELETE} /interactions/:id
 */
router.delete('/interactions/:id', auth.middleware.isUser, (req, res, next) => {
  return queries.deleteInteraction(req.params.id)
    .then((affectedRowCount) => {
      return res.json({ affectedRowCount: affectedRowCount });
    })
    .catch(next);
});

module.exports = router;
