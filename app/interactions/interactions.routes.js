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
router.get('/interactions', auth.middleware.isLoggedIn, validators.listInteractions, (req, res, next) => {
  const isSupervisor = auth.predicates.isSupervisor(req.user);

  return queries.listInteractions(isSupervisor ? false : req.user.id, req.query.search, req.query.page, req.query.perPage, req.query.sort)
    .then(result => res.json(result))
    .catch(next);
});

/**
 * Creates a new interaction
 * @name Create interaction
 * @route {POST} /interactions
 */
router.post('/interactions', auth.middleware.isLoggedIn, validators.createInteraction, (req, res, next) => {
  return queries.createInteraction(req.body)
    .then(insertedInteraction => res.status(201).json(insertedInteraction))
    .catch(next);
});

/**
 * Get specific interaction information for the given id.
 * @name Get interaction info
 * @route {GET} /interactions/:id
 */
router.get('/interactions/:id', auth.middleware.isLoggedIn, (req, res, next) => {
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
router.patch('/interactions/:id', auth.middleware.isLoggedIn, validators.updateInteraction, (req, res, next) => {
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
router.delete('/interactions/:id', auth.middleware.isLoggedIn, (req, res, next) => {
  return queries.deleteInteraction(req.params.id)
    .then((affectedRowCount) => {
      return res.json({ affectedRowCount: affectedRowCount });
    })
    .catch(next);
});

module.exports = router;
