/* eslint-disable no-unused-expressions */
'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const sinonChai = require('sinon-chai');
chai.use(chaiHttp);
chai.use(sinonChai);
const expect = chai.expect;
const routes = require('../app');
const knex = require('../components/knex');

describe('mentees handling', function () {
  beforeEach((done) => {
    knex.migrate.rollback()
      .then(() => knex.migrate.latest())
      .then(() => knex.seed.run())
      .then(() => done());
  });

  after((done) => {
    knex.migrate.rollback()
      .then(() => knex.migrate.latest())
      .then(() => knex.seed.run())
      .then(() => done());
  });

  describe('new mentee', function () {
    let createNewMentee = {
      'mentor_id': 1,
      'mentee_id': 3,
      'notes': 'Mentoring Agama 2017'
    };

    it('should not create new mentee if not logged in', (done) => {
      chai.request(routes).post('/api/mentees').send(createNewMentee).end((err, res) => {
        expect(err).to.be.falsy;
        expect(res).to.have.status(401);
        expect(res).to.be.a('object');
        expect(res.body).to.be.a('object');
        expect(res.body.message).to.equal('Unauthorized');
        expect(res.body.name).to.equal('UnauthorizedError');
        done();
      });
    });

    it('should not get specific mentee if not logged in', (done) => {
      chai.request(routes).post('/api/mentees').send(createNewMentee).end((err, res) => {
        expect(err).to.be.falsy;
        chai.request(routes).get('/api/mentees/' + res.body.id).end((err, resfromget) => {
          expect(err).to.be.falsy;
          expect(resfromget).to.have.status(401);
          expect(resfromget.body.message).to.equal('Unauthorized');
          expect(resfromget.body.name).to.equal('UnauthorizedError');
          done();
        });
      });
    });

    it('should not get list of mentees if not logged in', (done) => {
      chai.request(routes).post('/api/mentees').send(createNewMentee).end((err, res) => {
        expect(err).to.be.falsy;
        chai.request(routes).get('/api/mentees').end((err, resfromget) => {
          expect(err).to.be.falsy;
          expect(resfromget).to.have.status(401);
          expect(resfromget.body.message).to.equal('Unauthorized');
          expect(resfromget.body.name).to.equal('UnauthorizedError');
          done();
        });
      });
    });

    it('should not delete mentee if not logged in', (done) => {
      chai.request(routes).post('/api/mentees').send(createNewMentee).end((err, res) => {
        expect(err).to.be.falsy;
        chai.request(routes).delete('/api/mentees/' + res.body.id).end((err, resfromdel) => {
          expect(err).to.be.falsy;
          expect(resfromdel).to.have.status(401);
          expect(resfromdel.body.message).to.equal('Unauthorized');
          expect(resfromdel.body.name).to.equal('UnauthorizedError');
          done();
        });
      });
    });

    it('should not edit mentee if not logged in', (done) => {
      chai.request(routes).post('/api/mentees').send(createNewMentee).end((err, res) => {
        expect(err).to.be.falsy;
        chai.request(routes).patch('/api/mentees/' + res.body.id).send({ notes: 'Mentoring Agama semester ganjil 2017' }).end((err, resfrompatch) => {
          expect(err).to.be.falsy;
          expect(resfrompatch).to.have.status(401);
          expect(resfrompatch.body.message).to.equal('Unauthorized');
          expect(resfrompatch.body.name).to.equal('UnauthorizedError');
          done();
        });
      });
    });
  });
});
