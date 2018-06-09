'use strict';

const chai = require('chai');
const expect = chai.expect;
const { parseSortQuery } = require('./knexutils.js');

describe('Knex utilities', function () {
  describe('parseSortQuery', function () {
    it('should produce empty sort array for empty sort query strings', function () {
      expect(parseSortQuery(undefined)).to.eql([]);
      expect(parseSortQuery(null)).to.eql([]);
      expect(parseSortQuery('')).to.eql([]);
      expect(parseSortQuery({})).to.eql([]);
      expect(parseSortQuery(false)).to.eql([]);
    });

    it('should produce correct sort array for sort query strings', function () {
      expect(parseSortQuery('username')).to.eql([{ field: 'username', direction: 'ascending' }]);
      expect(parseSortQuery('+username')).to.eql([{ field: 'username', direction: 'ascending' }]);
      expect(parseSortQuery('-username')).to.eql([{ field: 'username', direction: 'descending' }]);

      expect(parseSortQuery('-id ,-username')).to.eql([
        { field: 'id', direction: 'descending' },
        { field: 'username', direction: 'descending' }
      ]);
      expect(parseSortQuery('username,id')).to.eql([
        { field: 'username', direction: 'ascending' },
        { field: 'id', direction: 'ascending' }
      ]);
      expect(parseSortQuery('username, id')).to.eql([
        { field: 'username', direction: 'ascending' },
        { field: 'id', direction: 'ascending' }
      ]);
      expect(parseSortQuery('username,-id')).to.eql([
        { field: 'username', direction: 'ascending' },
        { field: 'id', direction: 'descending' }
      ]);
      expect(parseSortQuery('-FieldAbc1,FieldAbc2,+username,-id')).to.eql([
        { field: 'FieldAbc1', direction: 'descending' },
        { field: 'FieldAbc2', direction: 'ascending' },
        { field: 'username', direction: 'ascending' },
        { field: 'id', direction: 'descending' }
      ]);
    });
  });
});
