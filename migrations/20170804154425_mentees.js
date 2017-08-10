exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('mentees', table => {
      table.increments().primary();
      table.integer('mentor_id').unsigned().notNullable();
      table.integer('mentee_id').unsigned().notNullable().unique();
      table.foreign('mentor_id').references('mentors.id').onDelete('RESTRICT');
      table.foreign('mentee_id').references('students.id').onDelete('RESTRICT');
      table.text('notes');
      table.timestamps();
    })
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable('mentees')
  ]);
};
