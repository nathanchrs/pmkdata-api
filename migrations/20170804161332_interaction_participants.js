exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('interaction_participants', table => {
      table.increments().primary();
      table.integer('interaction_id').unsigned().notNullable();
      table.integer('mentee_id').unsigned().notNullable().unique();
      table.foreign('interaction_id').references('interactions.id').onDelete('RESTRICT');
      table.foreign('mentee_id').references('mentees.id').onDelete('RESTRICT');
      table.timestamps();
    })
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable('interaction_participants')
  ]);
};
