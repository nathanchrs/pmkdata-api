'use strict';

const express = require('express');
const auth = require('../components/auth.js');
const errors = require('http-errors');
const queries = require('./students.queries');
const validators = require('./students.validators');
const config = require('config');

const router = express.Router();

/**
 * Load a student specified in the URL parameter id to req.object.
 */
async function loadStudent (req, res, next) {
  req.object = await queries.getStudent(req.params.id);
  if (!req.object) throw new errors.NotFound('Student not found.');
  return next();
}

/**
 * Check whether the current user is the owner of req.object.
 */
function checkOwner (req) {
  return req.user.nim === req.object.nim;
}

/**
 * Get a list of students.
 * @name List students
 * @route {GET} /students
 */
router.get('/students', auth.requirePrivilege('list-students'), validators.listStudents, async (req, res, next) => {
  const { page, perPage, sort, ...filters } = req.query;
  const result = await queries.listStudents({ page, perPage, sort, filters });
  return res.json(result);
});

/**
 * Get a list of students for searching.
 * @name Search students
 * @route {GET} /students
 */
router.get('/students/search', auth.requirePrivilege('search-students'), async (req, res, next) => {
  const result = await queries.searchStudents(req.query.search);
  return res.json(result);
});

/**
 * Creates a new student (login required, for admins, etc.).
 * Sets NIM to be equal to TPB NIM if NIM is empty.
 * @name Create student
 * @route {POST} /students
 */
router.post('/students', auth.requirePrivilege('create-student'), validators.createStudent, async (req, res, next) => {
  if (req.body.tpb_nim && !req.body.nim) req.body.nim = req.body.tpb_nim;

  const insertedStudent = await queries.createStudent(req.body);
  return res.status(201).json(insertedStudent);
});

/**
 * Public (no login required) endpoint for creating a new student (for registration forms, etc.).
 * Sets the student's year to the current year, prevents non-TPB NIM from being set.
 * Can be accessed if publicStudentRegistration config is true.
 * @name Public student registration
 * @route {POST} /students/public
 */
router.post('/students/public', validators.publicStudentRegistration, async (req, res, next) => {
  const publicStudentRegistration = config.get('publicStudentRegistration');
  if (!publicStudentRegistration) throw new errors.Forbidden('Public student registration is not available at the moment.');

  req.body.year = (new Date()).getFullYear();
  if (req.body.tpb_nim && !req.body.nim) req.body.nim = req.body.tpb_nim;

  const insertedStudent = await queries.createStudent(req.body);
  return res.status(201).json(insertedStudent);
});

/**
 * Get specific student information for the given id.
 * @name View student
 * @route {GET} /students/:id
 */
router.get('/students/:id', loadStudent, auth.requirePrivilege('view-student', checkOwner), async (req, res, next) => {
  return res.json(req.object);
});

/**
 * Updates student information for the given id.
 * @name Update student
 * @route {PATCH} /students/:id
 */
router.patch('/students/:id', loadStudent, auth.requirePrivilege('update-student', checkOwner), validators.updateStudent, async (req, res, next) => {
  const affectedRowCount = await queries.updateStudent(req.params.id, req.body);
  return res.json({ affectedRowCount });
});

/**
 * Delete the specified student.
 * @name Delete student
 * @route {DELETE} /students/:id
 */
router.delete('/students/:id', loadStudent, auth.requirePrivilege('delete-student', checkOwner), async (req, res, next) => {
  const affectedRowCount = await queries.deleteStudent(req.params.id);
  return res.json({ affectedRowCount });
});

module.exports = router;
