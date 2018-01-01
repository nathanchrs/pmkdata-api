exports.seed = async (knex, Promise) => {
  // Deletes ALL existing entries first
  await knex('role_privileges').del();

  await knex('role_privileges').insert([
    {
      role: 'user',
      privilege: 'view-student:owner'
    },
    {
      role: 'user',
      privilege: 'search-students'
    },
    {
      role: 'administrator',
      privilege: 'view-student'
    },
    {
      role: 'administrator',
      privilege: 'list-students'
    },
    {
      role: 'administrator',
      privilege: 'create-student'
    },
    {
      role: 'administrator',
      privilege: 'update-student'
    },
    {
      role: 'administrator',
      privilege: 'delete-student'
    }
  ]);
};
