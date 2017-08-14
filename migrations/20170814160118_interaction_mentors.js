
exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('interaction_mentors', table => {
      table.increments('id').primary();
      table.integer('interaction_id').unsigned().notNullable();
      table.integer('user_id').unsigned().notNullable();
      table.timestamps();

      // table.foreign('interaction_id').references('interactions.id').onDelete('RESTRICT');
      // table.foreign('user_id').references('users.id').onDelete('RESTRICT');
    })
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable('interaction_mentors')
  ]);
};
