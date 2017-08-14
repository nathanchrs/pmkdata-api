
exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('interaction_participants', table => {
      table.increments('id').primary();
      table.integer('interaction_id').unsigned().notNullable();
      table.integer('student_id').unsigned().notNullable();
      table.timestamps();

      // table.foreign('interaction_id').references('interactions.id').onDelete('RESTRICT');
      // table.foreign('student_id').references('students.id').onDelete('RESTRICT');
    })
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable('interaction_participants')
  ]);
};
