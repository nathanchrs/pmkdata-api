'use strict';

const knex = require('../common/knex');
const _ = require('lodash');

const rolePrivilegesColumns = ['role', 'privilege', 'created_at'];

module.exports = {
  listRoles: () => {
    return knex('role_privileges').distinct('role');
  },

  viewRolePrivileges: role => {
    return knex.select(_.without(rolePrivilegesColumns, 'role'))
      .from('role_privileges')
      .where('role', role);
  },

  createRolePrivilege: (role, privilege) => {
    return knex('role_privileges').insert({ role, privilege, created_at: new Date() });
  },

  deleteRolePrivilege: (role, privilege) => {
    return knex('role_privileges')
      .delete()
      .where(role, role)
      .andWhere(privilege, privilege);
  }
};
