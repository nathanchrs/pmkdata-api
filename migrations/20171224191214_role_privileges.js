
exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('role_privileges', table => {
      table.string('role');
      table.string('privilege');
      table.timestamps();
      table.primary(['role', 'privilege']);
    })
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable('role_privileges')
  ]);
};
