exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(() => {
      return Promise.all([
        // Inserts seed entries
        knex('users').insert({ username: 'admin', nim: '12315123', email: 'admin@pmk.itb.ac.id', password: '$2a$08$Wn3jW9b0VvPkshi272ctweyyn0O7.bFXx4xFCoNHpBdiCDashRI/q', role: 'admin', status: 'active' }) // Password: admin
      ]);
    });
};
