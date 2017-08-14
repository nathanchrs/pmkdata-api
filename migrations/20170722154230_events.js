
exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('events', table => {
      table.increments('id').primary();
      table.string('name');
      table.text('description');
      table.timestamps();
    })
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable('events')
  ]);
};
