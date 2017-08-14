exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
  return knex('mentees').del()
    .then(() => {
      // Inserts seed entries
      let mentees = [
        {
          mentor_id: 1,
          mentee_id: 1,
          notes: 'Mentoring PMB 2017'
        },
        {
          mentor_id: 1,
          mentee_id: 2,
          notes: 'Mentoring kelas agama 2017'
        }
      ];
      return Promise.all([
        knex('mentees').insert(mentees)
      ]);
    });
};
