
exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('interactions', table => {
      table.increments('id').primary();
      table.timestamp('time');
      table.string('title');
      table.text('notes');
      table.string('tags');
      table.timestamps();
    })
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable('interactions')
  ]);
};
