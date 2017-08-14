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

describe('interactions handling', function () {
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

  describe('new interaction', function () {
    let createNewInteraction = {
      time: '2017-08-04T08:41:56.233Z', // 04-08-2017 15:42 GMT+7
      notes: 'Laporan kelas agama',
      tags: 'Kelas Agama'
    };

    it('should not create new interaction if not logged in', (done) => {
      chai.request(routes).post('/api/interactions').send(createNewInteraction).end((err, res) => {
        expect(err).to.be.falsy;
        expect(res).to.have.status(401);
        expect(res).to.be.a('object');
        expect(res.body).to.be.a('object');
        expect(res.body.name).to.equal('UnauthorizedError');
        done();
      });
    });

    it('should not get specific interaction if not logged in', (done) => {
      chai.request(routes).post('/api/interactions').send(createNewInteraction).end((err, res) => {
        expect(err).to.be.falsy;
        expect(res).to.have.status(401);
        chai.request(routes).get('/api/interactions/' + res.body.id).end((err, resfromget) => {
          expect(err).to.be.falsy;
          expect(resfromget).to.have.status(401);
          expect(resfromget.body.name).to.equal('UnauthorizedError');
          done();
        });
      });
    });

    it('should not get list of interactions if not logged in', (done) => {
      chai.request(routes).post('/api/interactions').send(createNewInteraction).end((err, res) => {
        expect(err).to.be.falsy;
        expect(res).to.have.status(401);
        chai.request(routes).get('/api/interactions').end((err, resfromget) => {
          expect(err).to.be.falsy;
          expect(resfromget).to.have.status(401);
          expect(resfromget.body.name).to.equal('UnauthorizedError');
          done();
        });
      });
    });

    it('should not delete interaction if not logged in', (done) => {
      chai.request(routes).post('/api/interactions').send(createNewInteraction).end((err, res) => {
        expect(err).to.be.falsy;
        expect(res).to.have.status(401);
        chai.request(routes).delete('/api/interactions/' + res.body.id).end((err, resfromdel) => {
          expect(err).to.be.falsy;
          expect(resfromdel).to.have.status(401);
          expect(resfromdel.body.name).to.equal('UnauthorizedError');
          done();
        });
      });
    });

    it('should not edit interaction if not logged in', (done) => {
      chai.request(routes).post('/api/interactions').send(createNewInteraction).end((err, res) => {
        expect(err).to.be.falsy;
        expect(res).to.have.status(401);
        chai.request(routes).patch('/api/interactions/' + res.body.id).send({ notes: 'Laporan kelas agama 2017' }).end((err, resfrompatch) => {
          expect(err).to.be.falsy;
          expect(resfrompatch).to.have.status(401);
          expect(resfrompatch.body.name).to.equal('UnauthorizedError');
          done();
        });
      });
    });
  });
});
