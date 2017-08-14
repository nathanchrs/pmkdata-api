'use strict';

const express = require('express');
const auth = require('../components/auth.js');
const errors = require('http-errors');
const queries = require('./interactions.queries');
const validators = require('./interactions.validators');

const router = express.Router();

/** Custom auth middleware that checks whether the accessing user is a participating mentor for this interaction. */
const isInteractionMentorOrSupervisor = auth.createMiddlewareFromPredicate((user, req) => {
  if (auth.predicates.isSupervisor(user)) return true;
  return queries.isInteractionMentor(req.params.id, req.user.id);
});

/**
 * Get a list of interactions.
 * @name Get interactions
 * @route {GET} /interactions
 */
router.get('/interactions', auth.middleware.isLoggedIn, validators.listInteractions, (req, res, next) => {
  const filterByMentorId = auth.predicates.isSupervisor(req.user) ? false : req.user.id;
  return queries.listInteractions(req.query.search, req.query.page, req.query.perPage, req.query.sort, filterByMentorId)
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
router.get('/interactions/:id', isInteractionMentorOrSupervisor, (req, res, next) => {
  return queries.getInteraction(req.params.id)
    .then((interaction) => {
      if (!interaction) return next(new errors.NotFound('Interaction not found.'));
      return res.json(interaction);
    })
    .catch(next);
});

/**
 * Update interaction information for the given id.
 * @name Update interaction
 * @route {PATCH} /interactions/:id
 */
router.patch('/interactions/:id', isInteractionMentorOrSupervisor, validators.updateInteraction, (req, res, next) => {
  return queries.updateInteraction(req.params.id, req.body)
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
router.delete('/interactions/:id', isInteractionMentorOrSupervisor, (req, res, next) => {
  return queries.deleteInteraction(req.params.id)
    .then(affectedRowCount => res.json({ affectedRowCount: affectedRowCount }))
    .catch(next);
});

module.exports = router;
