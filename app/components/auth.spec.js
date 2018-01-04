/* eslint-disable no-unused-expressions */
'use strict';

const chai = require('chai');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const sinon = require('sinon');
const expect = chai.expect;
const errors = require('http-errors');
const knexCleaner = require('knex-cleaner');
const knex = require('./knex.js');
const auth = require('./auth.js');

describe('Auth', function () {
  before(async () => {
    await knexCleaner.clean(knex);
    await knex.migrate.latest();

    await knex('role_privileges').insert({ role: 'test-role-1', privilege: 'public-operation-name' });
    await knex('role_privileges').insert({ role: 'test-role-2', privilege: 'public-operation-2-name' });
    await knex('role_privileges').insert({ role: 'test-role-3', privilege: 'owner-operation-name:owner' });
    await knex('role_privileges').insert({ role: 'test-role-4', privilege: 'public-owner-operation-name' });
    await knex('role_privileges').insert({ role: 'test-role-4', privilege: 'public-owner-operation-name:owner' });

    await knex('user_roles').insert({ username: 'test-user-a', role: 'test-role-1' });
    await knex('user_roles').insert({ username: 'test-user-a', role: 'test-role-2' });
    await knex('user_roles').insert({ username: 'test-user-b', role: 'test-role-3' });
    await knex('user_roles').insert({ username: 'test-user-c', role: 'test-role-4' });
  });

  describe('requirePrivilege middleware', function () {
    it('should register privileges in availablePrivileges', async function () {
      const middleware = auth.requirePrivilege('operation-name');
      expect(auth.availablePrivileges['operation-name']).to.deep.equal({ all: true, owner: false });

      const middleware2 = auth.requirePrivilege('operation-name-2', () => {});
      expect(auth.availablePrivileges['operation-name-2']).to.deep.equal({ all: true, owner: true });

      // Owner must also be true in the following case since there is an operation-name-2 registered with owner: true already
      const middleware3 = auth.requirePrivilege('operation-name-2');
      expect(auth.availablePrivileges['operation-name-2']).to.deep.equal({ all: true, owner: true });
    });

    it('should throw HTTP Unauthorized if user is not logged in', async function () {
      const middleware = auth.requirePrivilege('public-operation-name');
      const nextSpy = sinon.spy();
      try {
        await middleware({}, {}, nextSpy);
      } catch (err) {
        expect(err).to.be.an.instanceOf(errors.Unauthorized);
      }
      expect(nextSpy).not.to.have.been.called;
    });

    it('should throw HTTP Forbidden if user does not have any privilege', async function () {
      const middleware = auth.requirePrivilege('public-operation-name');
      const nextSpy = sinon.spy();
      try {
        let req = { user: { username: 'unknown-user' } };
        await middleware(req, {}, nextSpy);
      } catch (err) {
        expect(err).to.be.an.instanceOf(errors.Forbidden);
      }
      expect(nextSpy).not.to.have.been.called;
    });

    it("should match 'public-operation-name' with 'all' access modifier", async function () {
      const middleware = auth.requirePrivilege('public-operation-name');
      const nextSpy = sinon.spy();
      let req = { user: { username: 'test-user-a' } };
      await middleware(req, {}, nextSpy);
      expect(nextSpy).to.have.been.called.calledWithExactly();
      expect(req.accessModifiers).to.deep.equal(['all']);
    });

    it("should match 'public-operation-2-name' with 'all' access modifier", async function () {
      const middleware = auth.requirePrivilege('public-operation-name');
      const nextSpy = sinon.spy();
      let req = { user: { username: 'test-user-a' } };
      await middleware(req, {}, nextSpy);
      expect(nextSpy).to.have.been.called.calledWithExactly();
      expect(req.accessModifiers).to.deep.equal(['all']);
    });

    it("should throw HTTP Forbidden for 'public-operation-forbidden'", async function () {
      const middleware = auth.requirePrivilege('public-operation-forbidden');
      const nextSpy = sinon.spy();
      try {
        let req = { user: { username: 'test-user-a' } };
        await middleware(req, {}, nextSpy);
      } catch (err) {
        expect(err).to.be.an.instanceOf(errors.Forbidden);
      }
      expect(nextSpy).not.to.have.been.called;
    });

    it("should match 'owner-operation-name:owner' with 'owner' access modifiers given a true checkOwner result", async function () {
      const checkOwnerStub = sinon.stub().returns(true);
      const middleware = auth.requirePrivilege('owner-operation-name', checkOwnerStub);
      const nextSpy = sinon.spy();
      let req = { user: { username: 'test-user-b' } };
      await middleware(req, {}, nextSpy);
      expect(checkOwnerStub).to.have.been.called;
      expect(nextSpy).to.have.been.called.calledWithExactly();
      expect(req.accessModifiers).to.deep.equal(['owner']);
    });

    it("should throw a HTTP Forbidden for 'forbidden-operation-name:owner' with 'owner' access modifiers given a true checkOwner result", async function () {
      const checkOwnerStub = sinon.stub().returns(true);
      const middleware = auth.requirePrivilege('forbidden-operation-name', checkOwnerStub);
      const nextSpy = sinon.spy();
      let req = { user: { username: 'test-user-b' } };
      try {
        await middleware(req, {}, nextSpy);
      } catch (err) {
        expect(err).to.be.an.instanceOf(errors.Forbidden);
      }
      expect(nextSpy).not.to.have.been.called;
    });

    it("should throw a TypeError for 'owner-operation-name:owner' if not given a checkOwner function", async function () {
      const middleware = auth.requirePrivilege('owner-operation-name');
      const nextSpy = sinon.spy();
      let req = { user: { username: 'test-user-b' } };
      try {
        await middleware(req, {}, nextSpy);
      } catch (err) {
        expect(err).to.be.an.instanceOf(TypeError);
      }
      expect(nextSpy).not.to.have.been.called;
    });

    it("should throw a HTTP Forbidden for 'owner-operation-name:owner' given a false checkOwner result", async function () {
      const checkOwnerStub = sinon.stub().returns(false);
      const middleware = auth.requirePrivilege('owner-operation-name', checkOwnerStub);
      const nextSpy = sinon.spy();
      let req = { user: { username: 'test-user-b' } };
      try {
        await middleware(req, {}, nextSpy);
      } catch (err) {
        expect(err).to.be.an.instanceOf(errors.Forbidden);
      }
      expect(checkOwnerStub).to.have.been.called;
      expect(nextSpy).not.to.have.been.called;
    });

    it("should match 'public-owner-operation-name:owner' with 'all' and 'owner' access modifiers given a true checkOwner result", async function () {
      const checkOwnerStub = sinon.stub().returns(true);
      const middleware = auth.requirePrivilege('public-owner-operation-name', checkOwnerStub);
      const nextSpy = sinon.spy();
      let req = { user: { username: 'test-user-c' } };
      await middleware(req, {}, nextSpy);
      expect(checkOwnerStub).to.have.been.called;
      expect(nextSpy).to.have.been.called.calledWithExactly();
      expect(req.accessModifiers).to.have.same.members(['all', 'owner']);
    });

    it("should match 'public-owner-operation-name:owner' with 'all' access modifier given a false checkOwner result", async function () {
      const checkOwnerStub = sinon.stub().returns(false);
      const middleware = auth.requirePrivilege('public-owner-operation-name', checkOwnerStub);
      const nextSpy = sinon.spy();
      let req = { user: { username: 'test-user-c' } };
      await middleware(req, {}, nextSpy);
      expect(checkOwnerStub).to.have.been.called;
      expect(nextSpy).to.have.been.called.calledWithExactly();
      expect(req.accessModifiers).to.have.same.members(['all']);
    });
  });

  describe('isLoggedIn middleware', function () {
    it('should continue if req.user is logged in', function () {
      const nextSpy = sinon.spy();
      auth.isLoggedIn({ user: {} }, {}, nextSpy);
      expect(nextSpy).to.have.been.calledOnce;
      expect(nextSpy).to.have.been.calledWithExactly();
    });

    it('should throw HTTP Unauthorized if req.user is not logged in', function () {
      const nextSpy = sinon.spy();
      try {
        auth.isLoggedIn({}, {}, nextSpy);
      } catch (err) {
        expect(err).to.be.an.instanceOf(errors.Unauthorized);
      }
      expect(nextSpy).not.to.have.been.called;
    });
  });
});
