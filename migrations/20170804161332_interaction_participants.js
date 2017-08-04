exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('interaction_participants', table => {
      table.increments().primary();
      table.integer('interaction_id').unsigned().notNullable();
      // foreign key reserve here (primary key from interactions table) -- unsigned because of mysql
      table.integer('mentee_id').unsigned().notNullable().unique();
      // foreign key reserve here (primary key from students table, unique) -- unsigned because of mysql
      table.timestamps();
    })
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable('interaction_participants')
  ]);
};
