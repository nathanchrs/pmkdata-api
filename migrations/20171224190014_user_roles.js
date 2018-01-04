
exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('user_roles', table => {
      table.string('username');
      table.string('role');
      table.dateTime('created_at');
      table.primary(['username', 'role']);
    })
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable('user_roles')
  ]);
};
