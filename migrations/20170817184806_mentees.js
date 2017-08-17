
exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('mentees', table => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable();
      table.integer('student_id').unsigned().notNullable();
      table.string('notes');
      table.timestamps();
    })
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable('interaction_mentors')
  ]);
};
