
exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('mentors').del()
    .then(() => {
      return Promise.all([
        knex('mentors').insert({
          mentor_username: 'admin',
          event_id: 1,
          status: 'active'
        })
      ]);
    });
};
