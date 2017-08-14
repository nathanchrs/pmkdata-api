
exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('users', table => {
      table.increments('id').primary();
      table.string('username').unique();
      table.integer('nim');
      table.string('email');
      table.string('password');
      table.string('role');
      table.string('status');
      table.timestamps();
    })
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable('users')
  ]);
};
