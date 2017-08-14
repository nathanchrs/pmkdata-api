exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
  return knex('interaction_participants').del()
    .then(() => {
      // Inserts seed entries
      let interactionParticipants = [
        {
          interaction_id: 1,
          mentee_id: 1
        },
        {
          interaction_id: 1,
          mentee_id: 2
        }
      ];
      return Promise.all([
        knex('interaction_participants').insert(interactionParticipants)
      ]);
    });
};
