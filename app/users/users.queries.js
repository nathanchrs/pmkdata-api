'use strict';

const knex = require('../components/knex.js');
const errors = require('http-errors');
const bcrypt = require('bcryptjs');
const _ = require('lodash');

const BCRYPT_STRENGTH = 8;

async function checkPassword (username, password) {
  const user = await knex.first('username', 'password').from('users').where('username', username);
  if (!user) return false;

  const passwordMatches = await bcrypt.compare(password, user.password);
  return passwordMatches;
}

const userColumns = ['username', 'nim', 'email', 'password', 'status', 'created_at', 'updated_at'];
const userAssignableColumns = ['username', 'nim', 'email', 'status'];
const userSearchableColumns = ['username', 'nim', 'email'];
const userSortableColumns = ['username', 'nim', 'email', 'status', 'created_at', 'updated_at'];
const userFilters = {
  username: {},
  nim: {},
  email: {},
  status: { operator: '=' },
  createdSince: { field: 'created_at', operator: '>=' },
  createdUntil: { field: 'created_at', operator: '<=' },
  updatedSince: { field: 'updated_at', operator: '>=' },
  updatedUntil: { field: 'updated_at', operator: '<=' },
};

const userRolesColumns = ['username', 'role', 'created_at'];
const rolePrivilegesColumns = ['role', 'privilege', 'created_at'];

module.exports = {
  listUsers: (search, page, perPage, sort, filters) => {
    return knex.select(userColumns.map(column => 'users.' + column + ' as ' + column).concat(['name']))
      .from('users')
      .leftJoin('students', 'users.nim', 'students.nim')
      .filter(filters, userFilters)
      .search(search, userSearchableColumns.map(column => 'users.' + column).concat(['name']))
      .pageAndSort(page, perPage, sort, userSortableColumns.map(column => 'users.' + column).concat(['name']));
  },

  searchUsers: (search) => {
    return knex.select(['users.username as username', 'name', 'department', 'year'])
      .from('users')
      .leftJoin('students', 'users.nim', 'students.nim')
      .search(search, ['name', 'username'])
      .limit(20);
  },

  createUser: (newUser) => {
    let query = knex.select('username').from('users').where('username', newUser.username);
    if (newUser.nim) query = query.orWhere('nim', newUser.nim);

    newUser = _.pick(newUser, userAssignableColumns);
    newUser.created_at = newUser.updated_at = new Date();

    return query.first()
      .then((existingUsers) => {
        if (existingUsers) {
          if (existingUsers.username === newUser.username) {
            throw new errors.Conflict('Username already exists.');
          } else {
            throw new errors.Conflict('There is already a user for this NIM.');
          }
        }
        return bcrypt.hash(newUser.password, BCRYPT_STRENGTH);
      })
      .then((hash) => {
        newUser.password = hash;
        return knex('users').insert(newUser).then(insertedUsernames => Object.assign(newUser, { password: '' }));
      });
  },

  getUser: (username) => {
    return knex.select(userColumns)
      .from('users')
      .where('username', username)
      .first();
  },

  updateUser: async (username, userUpdates) => {
    userUpdates = _.pick(userUpdates, userAssignableColumns);
    userUpdates.updated_at = new Date();
    return knex('users').update(userUpdates).where('username', username);
  },

  updateUserPassword: async (username, newPassword, requireOldPasswordCheck, oldPassword) => {
    if (requireOldPasswordCheck && !(await checkPassword(username, oldPassword))) {
      throw new errors.Unauthorized('Wrong username or password.');
    }

    const hash = await bcrypt.hash(newPassword, BCRYPT_STRENGTH);
    return knex('users')
      .update({ password: hash, updated_at: new Date() })
      .where('username', username);
  },

  deleteUser: (username) => {
    return knex('users').delete().where('username', username);
  },

  listUserRoles: (username) => {
    return knex.select(_.without(userRolesColumns, 'username'))
      .from('user_roles')
      .where('username', username);
  },

  addUserRole: (username, role) => {
    return knex('user_roles').insert({ username, role, created_at: new Date() });
  },

  removeUserRole: (username, role) => {
    return knex('user_roles').delete()
      .where('username', username)
      .andWhere('role', role);
  },

  listUserPrivileges: username => {
    return knex.select(rolePrivilegesColumns.map(column => 'role_privileges.' + column + ' as ' + column))
      .from('user_roles')
      .leftJoin('role_privileges', 'user_roles.role', 'role_privileges.role')
      .where('username', username);
  }

};
