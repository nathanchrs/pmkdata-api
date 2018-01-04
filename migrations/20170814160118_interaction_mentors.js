
exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('interaction_mentors', table => {
      table.integer('interaction_id').unsigned().notNullable();
      table.string('user_username').notNullable();
      table.dateTime('created_at');

      table.primary(['interaction_id', 'user_username']);
      // table.foreign('interaction_id').references('interactions.id').onDelete('RESTRICT');
      // table.foreign('user_username').references('users.username').onDelete('RESTRICT');
    })
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable('interaction_mentors')
  ]);
};
