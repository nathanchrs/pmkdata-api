exports.seed = async (knex, Promise) => {
  // Deletes ALL existing entries first
  await knex('role_privileges').del();

  await knex('role_privileges').insert([
    { role: 'administrator', privilege: 'list-interactions' },
    { role: 'administrator', privilege: 'create-interaction' },
    { role: 'administrator', privilege: 'view-interaction' },
    { role: 'administrator', privilege: 'update-interaction' },
    { role: 'administrator', privilege: 'delete-interaction' },
    { role: 'administrator', privilege: 'list-interaction-mentors' },
    { role: 'administrator', privilege: 'create-interaction-mentor' },
    { role: 'administrator', privilege: 'delete-interaction-mentor' },
    { role: 'administrator', privilege: 'list-interaction-participants' },
    { role: 'administrator', privilege: 'create-interaction-participant' },
    { role: 'administrator', privilege: 'delete-interaction-participant' },

    { role: 'administrator', privilege: 'list-roles' },
    { role: 'administrator', privilege: 'view-role-privileges' },
    { role: 'administrator', privilege: 'create-role-privilege' },
    { role: 'administrator', privilege: 'delete-role-privilege' },
    { role: 'administrator', privilege: 'list-available-privileges' },

    { role: 'administrator', privilege: 'list-students' },
    { role: 'administrator', privilege: 'search-students' },
    { role: 'administrator', privilege: 'create-student' },
    { role: 'administrator', privilege: 'view-student' },
    { role: 'administrator', privilege: 'update-student' },
    { role: 'administrator', privilege: 'delete-student' },

    { role: 'administrator', privilege: 'list-users' },
    { role: 'administrator', privilege: 'search-users' },
    { role: 'administrator', privilege: 'create-user' },
    { role: 'administrator', privilege: 'view-user' },
    { role: 'administrator', privilege: 'update-user' },
    { role: 'administrator', privilege: 'update-user-password' },
    { role: 'administrator', privilege: 'delete-user' },
    { role: 'administrator', privilege: 'list-user-roles' },
    { role: 'administrator', privilege: 'create-user-role' },
    { role: 'administrator', privilege: 'delete-user-role' },
    { role: 'administrator', privilege: 'list-user-privileges' },

    { role: 'user', privilege: 'view-user:owner' },
    { role: 'user', privilege: 'update-user:owner' },
    { role: 'user', privilege: 'update-user-password:owner' },
    { role: 'user', privilege: 'list-user-roles:owner' },
    { role: 'user', privilege: 'list-user-privileges:owner' },

    { role: 'anggota-pmk', privilege: 'search-students' },
    { role: 'anggota-pmk', privilege: 'view-student:owner' },
    { role: 'anggota-pmk', privilege: 'search-users' }

  ]);
};
