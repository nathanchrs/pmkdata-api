'use strict';

const express = require('express');
const auth = require('../components/auth.js');
const errors = require('http-errors');
const queries = require('./events.queries');
const validators = require('./events.validators');

const router = express.Router();

/**
 * Get a list of events.
 * @name Get events
 * @route {GET} /events
 */
router.get('/events', auth.middleware.isLoggedIn, validators.listEvents, (req, res, next) => {
  return queries.listEvents(req.query.search, req.query.page, req.query.perPage, req.query.sort)
    .then(result => res.json(result))
    .catch(next);
});

/**
 * Creates a new event
 * @name Create event
 * @route {POST} /events
 */
router.post('/events', auth.middleware.isSupervisor, validators.createEvent, (req, res, next) => {
  return queries.createEvent(req.body)
    .then(insertedEvent => res.status(201).json(insertedEvent))
    .catch(next);
});

/**
 * Get specific event information for the given id.
 * @name Get event info
 * @route {GET} /events/:id
 */
router.get('/events/:id', auth.middleware.isLoggedIn, (req, res, next) => {
  return queries.getEvent(req.params.id)
    .then(event => {
      if (!event) return next(new errors.NotFound('Event not found.'));
      return res.json(event);
    })
    .catch(next);
});

/**
 * Updates event information for the given id.
 * @name Update event
 * @route {PATCH} /events/:id
 */
router.patch('/events/:id', auth.middleware.isSupervisor, validators.updateEvent, (req, res, next) => {
  return queries.updateEvent(req.params.id, req.body)
    .then(affectedRowCount => res.json({ affectedRowCount: affectedRowCount }))
    .catch(next);
});

/**
 * Delete the specified event.
 * @name Delete event
 * @route {DELETE} /events/:id
 */
router.delete('/events/:id', auth.middleware.isSupervisor, (req, res, next) => {
  return queries.deleteEvent(req.params.id)
    .then(affectedRowCount => res.json({ affectedRowCount: affectedRowCount }))
    .catch(next);
});

module.exports = router;
