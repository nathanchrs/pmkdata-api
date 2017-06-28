/* eslint-disable no-unused-expressions */
'use strict';

const chai = require('chai');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const sinon = require('sinon');
const expect = chai.expect;

const auth = require('./auth.js');

describe('Auth', function () {
  describe('isLoggedIn middleware', function () {
    it('should continue if req.user is not falsy', function () {
      const nextSpy = sinon.spy();
      auth.isLoggedIn({ user: {} }, {}, nextSpy);
      expect(nextSpy).to.have.been.calledOnce;
      expect(nextSpy).to.have.been.calledWithExactly();
    });

    it('should pass HTTP 401 if req.user is falsy', function () {
      const nextSpy = sinon.spy();
      auth.isLoggedIn({}, {}, nextSpy);
      expect(nextSpy).to.have.been.calledOnce;
      expect(nextSpy.args[0][0].status).to.be.equal(401);
    });
  });

  describe('isAdmin middleware', function () {
    it('should continue if user.role is admin', function () {
      const nextSpy = sinon.spy();
      auth.isAdmin({ user: { role: 'admin' } }, {}, nextSpy);
      expect(nextSpy).to.have.been.calledOnce;
      expect(nextSpy).to.have.been.calledWithExactly();
    });

    it('should pass HTTP 403 if user.role is not admin', function () {
      const nextSpy = sinon.spy();
      auth.isAdmin({ user: { role: 'supervisor' } }, {}, nextSpy);
      expect(nextSpy).to.have.been.calledOnce;
      expect(nextSpy.args[0][0].status).to.be.equal(403);
    });

    it('should pass HTTP 401 if req.user is falsy', function () {
      const nextSpy = sinon.spy();
      auth.isAdmin({}, {}, nextSpy);
      expect(nextSpy).to.have.been.calledOnce;
      expect(nextSpy.args[0][0].status).to.be.equal(401);
    });
  });

  describe('isSupervisor middleware', function () {
    it('should continue if user.role is admin', function () {
      const nextSpy = sinon.spy();
      auth.isSupervisor({ user: { role: 'admin' } }, {}, nextSpy);
      expect(nextSpy).to.have.been.calledOnce;
      expect(nextSpy).to.have.been.calledWithExactly();
    });

    it('should continue if user.role is supervisor', function () {
      const nextSpy = sinon.spy();
      auth.isSupervisor({ user: { role: 'supervisor' } }, {}, nextSpy);
      expect(nextSpy).to.have.been.calledOnce;
      expect(nextSpy).to.have.been.calledWithExactly();
    });

    it('should pass HTTP 403 if user.role is not admin or supervisor', function () {
      const nextSpy = sinon.spy();
      auth.isSupervisor({ user: { role: 'user' } }, {}, nextSpy);
      expect(nextSpy).to.have.been.calledOnce;
      expect(nextSpy.args[0][0].status).to.be.equal(403);
    });

    it('should pass HTTP 401 if req.user is falsy', function () {
      const nextSpy = sinon.spy();
      auth.isSupervisor({}, {}, nextSpy);
      expect(nextSpy).to.have.been.calledOnce;
      expect(nextSpy.args[0][0].status).to.be.equal(401);
    });
  });
});
