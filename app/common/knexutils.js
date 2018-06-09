'use strict';
const _ = require('lodash');
const constants = require('../common/constants');

/**
 * Parses a sort query string to a sort array.
 * @param sortQuery {string} Comma-separated string of fields to sort by. Sorts ascending by default.
 *        Prefix field name with '-' to sort descending.
 *        e.g. 'name', '-nim', 'name, nim'
 * @returns An array of { field: ..., direction: ... }.
 */
function parseSortQuery (sortQuery) {
  // Split comma-delimited values regardless of whitespace
  let parts = (sortQuery && typeof sortQuery === 'string') ? sortQuery.split(/\s*,\s*/) : [];

  let sort = [];
  for (let i = 0; i < parts.length; i++) {
    let field = parts[i];
    let direction = constants.sortDirection.ASCENDING;
    if (_.startsWith(field, '+')) field = field.slice(1);
    if (_.startsWith(field, '-')) {
      field = field.slice(1);
      direction = constants.sortDirection.DESCENDING;
    }
    field = field.trim();
    sort.push({ field, direction });
  }
  return sort;
}

/**
 * Extends a Knex query with basic filtering, sorting, and pagination support.
 * Filtering will be done first, then sorting, and finally pagination.
 * @param knex {Knex} The Knex instance used.
 * @param query {Query} A Knex query to extend.
 * @param options {object} May contain the following objects:
 *  - filters: {object} Each filter object can have a field (default: same as filter name) and/or operator (default: 'contains')
 *    e.g. { name: {}, nim: { operator: '=' }, createdAfter: { field: 'created_at', operator: '>' } }
 *    Permitted operators are the same as Knex where operators
 *    except 'contains', which is the same as the 'like' operator but with '%' wildcards before and after the filter value.
 *  - sortableFields: {array} Array of string, which are field names that can be sorted.
 * @param params {object} May contain the following objects:
 *  - filters: {object} In the format { filterName: value, ... }.
 *  - page: {number} The page number to retrieve (pages start from 1), default is 1.
 *  - perPage: {number} Number of items per page, default is 20.
 *  - sort: {array}  Array of sort objects.  Each sort object can specify a field
 *    and an optional direction for it (default: 'ascending', can also be 'descending').
 *    If a string is given, a conversion will be attempted using parseSortQuery function.
 *    e.g. [ { field: 'username' }, { field: 'nim', direction: 'descending' }]
 * @returns A promise that returns a result object, containing:
 *  - data: {array} The filtered, sorted and paginated query result.
 *  - page: {number} Current page number.
 *  - perPage: {number} The limit for number of results per page.
 *  - lastPage: {number} The last page for this query.
 *  - totalCount: {number} The total number of items for the unpaginated query result.
 *  - filters: {object} Like params.filters, but only contains the actual filters applied.
 *  - sort: {array} Like params.sort, but only contains the actual sorted fields.
 */
function withParams (knex, query, options, params) {
  // Extend query with filters
  let appliedFilters = {};
  if (params.filters && options.filters) {
    query = query.where(function () {
      let innerQuery = this;
      for (let filterName in options.filters) {
        let filterField = options.filters[filterName].field || filterName;
        if (params.filters[filterName] !== undefined) {
          let filterOperator = options.filters[filterName].operator || 'contains';
          let filterValue = params.filters[filterName];
          if (filterOperator === 'contains') {
            filterOperator = 'like';
            filterValue = '%' + filterValue + '%';
          }
          innerQuery = innerQuery.where(filterField, filterOperator, filterValue);
          appliedFilters[filterName] = params.filters[filterName];
        }
      }
    });
  }

  // Extend query with sort
  let sortedFields = [];
  if (typeof params.sort === 'string') params.sort = parseSortQuery(params.sort);
  if (_.isArray(params.sort)) {
    for (let i = 0; i < params.sort.length; i++) {
      const { field, direction } = params.sort[i];
      if (!options.sortableFields || _.includes(options.sortableFields, field)) {
        query = query.orderBy(field, direction === constants.sortDirection.DESCENDING ? 'desc' : 'asc'); // Default direction: ascending
        sortedFields.push({ field, direction });
      }
    }
  }

  // Extend query with pagination
  let { page, perPage } = params;
  page = +page || 1;
  if (page < 1) page = 1;
  perPage = +perPage || 20;
  let offset = (page - 1) * perPage;
  return Promise.all([
    knex.from(query.clone().as('query')).count('* as count').first(), // WARNING: need to find some way to get a Knex instance from the current query instead.
    query.offset(offset).limit(perPage)
  ]).then(values => ({
    data: values[1],
    page,
    perPage,
    lastPage: Math.ceil(values[0].count / perPage),
    totalCount: values[0].count,
    filters: appliedFilters,
    sort: sortedFields
  })
  );
}

module.exports = { parseSortQuery, withParams };
