exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('mentors', table => {
      table.increments().primary();
      table.string('mentor_username').notNullable();
      table.foreign('mentor_username').references('users.username').onDelete('RESTRICT');
      table.integer('event_id').unsigned().notNullable();
      table.unique(['mentor_username', 'event_id']);
      table.foreign('event_id').references('events.id').onDelete('RESTRICT');
      table.string('status');
      table.timestamps();
    })
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable('mentors')
  ]);
};
