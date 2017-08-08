exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('students', table => {
      table.increments().primary();
      table.integer('tpb_nim');
      table.integer('nim');
      table.integer('year');
      table.string('department');
      table.string('name');
      table.string('gender');
      table.date('birth_date');
      table.string('phone');
      table.string('parent_phone');
      table.string('line');
      table.string('high_school');
      table.string('church');
      table.string('bandung_address');
      table.string('hometown_address');
      table.timestamps();
    })
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable('students')
  ]);
};
