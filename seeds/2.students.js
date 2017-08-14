exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
  return knex('students').del()
    .then(() => {
      let students = [
        {
          year: 2015,
          department: 'STEI',
          name: 'dre',
          gender: 'male',
          birth_date: '1997-11-11',
          phone: '0811234567',
          parent_phone: '08111111',
          line: 'drees',
          high_school: 'SMA. <undefined>',
          church: 'GKI MY',
          current_address: 'Jalan Ganesha no 10',
          hometown_address: 'Jalan Sisingamangaraja Medan'
        },
        {
          year: 2016,
          department: 'STEI',
          name: 'dre2',
          gender: 'male',
          birth_date: '1997-11-11',
          phone: '0811234567',
          parent_phone: '08111111',
          line: 'drees',
          high_school: 'SMA. Stosa',
          church: 'GKI Maulana Yusuf',
          current_address: 'Jalan Ganesha no 10',
          hometown_address: 'Jalan Sisingamangaraja Medan'
        }
      ];
      return Promise.all([
        knex('students').insert(students)
      ]);
    });
};
