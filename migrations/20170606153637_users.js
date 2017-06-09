
exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('users', table => {
      table.string('username').primary();
      table.integer('nim');
      table.string('email');
      table.string('password');
      table.string('role');
      table.timestamps();
    })
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable('users')
  ]);
};
