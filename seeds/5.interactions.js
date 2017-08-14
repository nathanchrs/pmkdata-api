exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
  return knex('interactions').del()
    .then(() => {
      // Inserts seed entries
      let interactions = [
        {
          time: '2017-08-12 08:00:00', // YYYY-MM-DD HH:MM:SS
          title: 'KTB OSKM',
          notes: 'Laporan mahasiswa baru ITB',
          tags: 'PMB'
        },
        {
          time: '2017-08-12 09:00:00', // YYYY-MM-DD HH:MM:SS
          title: 'Komsel 1',
          notes: 'Eval PMB 2017',
          tags: 'PMB'
        }
      ];
      return Promise.all([
        knex('interactions').insert(interactions)
      ]);
    });
};
