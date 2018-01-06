exports.seed = async (knex, Promise) => {
  // Deletes ALL existing entries first
  await knex('users').del();
  await knex('user_roles').del();

  await knex('users').insert([
    {
      username: 'admin',
      email: 'admin@pmk.itb.ac.id',
      password: '$2a$08$gsMdZEtDjF7V3UE2sxj3UuorhAT5nexH0gdu4eVABCQfSjqz5npmO',
      status: 'active'
    } // Password: admin
  ]);

  await knex('user_roles').insert([
    {
      username: 'admin',
      role: 'administrator'
    }
  ]);
};
