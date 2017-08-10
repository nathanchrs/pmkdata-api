exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(() => {
      let users = [
        {
          username: 'admin',
          nim: '12315123',
          email: 'admin@pmk.itb.ac.id',
          password: '$2a$08$QwNk.YBBpry2N09/LVudj.ZvVtkL.6JIYvGd8Y8MT9VQ3mMfHwF8S',
          role: 'admin',
          status: 'active'
        }, // Password: admin
        {
          username: 'admin2',
          nim: '13515123',
          email: 'admin2@pmk.itb.ac.id',
          password: '$2a$08$QwNk.YBBpry2N09/LVudj.ZvVtkL.6JIYvGd8Y8MT9VQ3mMfHwF8S',
          role: 'admin',
          status: 'active'
        } // Password: admin, for testing foreign key
      ];
      return Promise.all([
        // Inserts seed entries
        knex('users').insert(users)
      ]);
    });
};
