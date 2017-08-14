exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
  return knex('events').del()
    .then(() => {
      // Inserts seed entries
      let events = [
        {
          name: 'PMB 2017',
          description: 'Penerimaan Mahasiswa Baru ITB 2017'
        },
        {
          name: 'RETRET 2016',
          description: 'Retret Kelas Agama Kristen Protestan 2016'
        }
      ];
      return Promise.all([
        knex('events').insert(events)
      ]);
    });
};
