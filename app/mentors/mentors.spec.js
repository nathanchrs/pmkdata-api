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

describe('mentors handling', function () {
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

  describe('new mentor', function () {
    let createNewMentor = {
      mentor_username: 'admin2',
      event_id: 2
    };

    it('should return 201 after creating new mentor', (done) => {
      chai.request(routes).post('/api/mentors').send(createNewMentor).end((err, res) => {
        expect(err).to.be.falsy;
        expect(res).to.have.status(201);
        expect(res).to.be.a('object');
        expect(res.body).to.be.a('object');
        expect(res.body).to.haveOwnProperty('created_at');
        expect(res.body).to.haveOwnProperty('updated_at');
        expect(res.body.mentor_username).to.equal('admin2');
        done();
      });
    });

    it('should not get specific mentor if not logged in', (done) => {
      chai.request(routes).post('/api/mentors').send(createNewMentor).end((err, res) => {
        expect(err).to.be.falsy;
        chai.request(routes).get('/api/mentors/' + res.body.id).end((err, resfromget) => {
          expect(err).to.be.falsy;
          expect(resfromget).to.have.status(401);
          expect(resfromget.body.message).to.equal('Unauthorized');
          expect(resfromget.body.name).to.equal('UnauthorizedError');
          done();
        });
      });
    });

    it('should not get list of mentors if not logged in', (done) => {
      chai.request(routes).post('/api/mentors').send(createNewMentor).end((err, res) => {
        expect(err).to.be.falsy;
        chai.request(routes).get('/api/mentors').end((err, resfromget) => {
          expect(err).to.be.falsy;
          expect(resfromget).to.have.status(401);
          expect(resfromget.body.message).to.equal('Unauthorized');
          expect(resfromget.body.name).to.equal('UnauthorizedError');
          done();
        });
      });
    });

    it('should not delete mentor if not logged in', (done) => {
      chai.request(routes).post('/api/mentors').send(createNewMentor).end((err, res) => {
        expect(err).to.be.falsy;
        chai.request(routes).delete('/api/mentors/' + res.body.id).end((err, resfromdel) => {
          expect(err).to.be.falsy;
          expect(resfromdel).to.have.status(401);
          expect(resfromdel.body.message).to.equal('Unauthorized');
          expect(resfromdel.body.name).to.equal('UnauthorizedError');
          done();
        });
      });
    });

    it('should not edit mentor if not logged in', (done) => {
      chai.request(routes).post('/api/mentors').send(createNewMentor).end((err, res) => {
        expect(err).to.be.falsy;
        chai.request(routes).patch('/api/mentors/' + res.body.id).send({ mentor_username: 'admin' }).end((err, resfrompatch) => {
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
