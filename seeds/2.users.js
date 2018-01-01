exports.seed = async (knex, Promise) => {
  // Deletes ALL existing entries first
  await knex('users').del();
  await knex('user_roles').del();

  await knex('users').insert([
    {
      username: 'admin',
      email: 'admin@pmk.itb.ac.id',
      password: '$2a$08$QwNk.YBBpry2N09/LVudj.ZvVtkL.6JIYvGd8Y8MT9VQ3mMfHwF8S',
      status: 'active'
    } // Password: admin
  ]);

  await knex('user_roles').insert([
    {
      username: 'admin',
      role: 'administrator'
    },
    {
      username: 'admin',
      role: 'user'
    }
  ]);
};
