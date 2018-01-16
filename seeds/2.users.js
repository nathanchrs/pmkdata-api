exports.seed = async (knex, Promise) => {
  // Deletes ALL existing entries first
  await knex('users').del();
  await knex('user_roles').del();

  await knex('users').insert([
    {
      username: 'admin',
      email: 'admin@pmk.itb.ac.id',
      password: '$2a$08$Dhq4WyG.tnPaplg6FKiwZebyco8BVEixV9qum3mnCT26PHviqogiS',
      status: 'active'
    } // Password: admin123
  ]);

  await knex('user_roles').insert([
    {
      username: 'admin',
      role: 'administrator'
    }
  ]);
};
