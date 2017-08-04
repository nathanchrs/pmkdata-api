exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('mentees', table => {
      table.increments().primary();
      table.integer('mentor_id').unsigned().notNullable();
      // foreign key reserve here (primary key from mentors table) -- unsigned because of mysql
      table.integer('mentee_id').unsigned().notNullable().unique();
      // foreign key reserve here (primary key from students table, unique) -- unsigned because of mysql
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
