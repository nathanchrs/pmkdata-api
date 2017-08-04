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

describe('events handling', function () {
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

  describe('new event', function () {
    let createNewEvent = {
      'name': 'Kelas Agama Kristen Protestan 2017',
      'description': 'Semester Ganjil'
    };

    it('should return 201 after creating new event', (done) => {
      chai.request(routes).post('/api/events').send(createNewEvent).end((err, res) => {
        expect(err).to.be.falsy;
        expect(res).to.have.status(201);
        expect(res).to.be.a('object');
        expect(res.body).to.be.a('object');
        expect(res.body).to.haveOwnProperty('created_at');
        expect(res.body).to.haveOwnProperty('updated_at');
        expect(res.body.name).to.equal('Kelas Agama Kristen Protestan 2017');
        done();
      });
    });

    it('should not get specific event if not logged in', (done) => {
      chai.request(routes).post('/api/events').send(createNewEvent).end((err, res) => {
        expect(err).to.be.falsy;
        chai.request(routes).get('/api/events/' + res.body.id).end((err, resfromget) => {
          expect(err).to.be.falsy;
          expect(resfromget).to.have.status(401);
          expect(resfromget.body.message).to.equal('Unauthorized');
          expect(resfromget.body.name).to.equal('UnauthorizedError');
          done();
        });
      });
    });

    it('should not get list of events if not logged in', (done) => {
      chai.request(routes).post('/api/events').send(createNewEvent).end((err, res) => {
        expect(err).to.be.falsy;
        chai.request(routes).get('/api/events').end((err, resfromget) => {
          expect(err).to.be.falsy;
          expect(resfromget).to.have.status(401);
          expect(resfromget.body.message).to.equal('Unauthorized');
          expect(resfromget.body.name).to.equal('UnauthorizedError');
          done();
        });
      });
    });

    it('should not delete event if not logged in', (done) => {
      chai.request(routes).post('/api/events').send(createNewEvent).end((err, res) => {
        expect(err).to.be.falsy;
        chai.request(routes).delete('/api/events/' + res.body.id).end((err, resfromdel) => {
          expect(err).to.be.falsy;
          expect(resfromdel).to.have.status(401);
          expect(resfromdel.body.message).to.equal('Unauthorized');
          expect(resfromdel.body.name).to.equal('UnauthorizedError');
          done();
        });
      });
    });

    it('should not edit event if not logged in', (done) => {
      chai.request(routes).post('/api/events').send(createNewEvent).end((err, res) => {
        expect(err).to.be.falsy;
        chai.request(routes).patch('/api/events/' + res.body.id).send({ description: 'Semester genap' }).end((err, resfrompatch) => {
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
