exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
  return knex('students').del()
        .then(() => {
            // Inserts seed entries
          return Promise.all([
            knex('students').insert({
              year: 2015,
              department: 'STEI',
              name: 'dre',
              gender: 'man',
              birth_date: '1997-11-11',
              phone: '0811234567',
              line: 'drees',
              high_school: 'SMA. <undefined>',
              church: 'GKI MY'
            })
          ]);
        });
};
