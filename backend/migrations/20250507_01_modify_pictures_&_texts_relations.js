module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.removeConstraint('pictures', 'fk_text_id');

    await queryInterface.addConstraint('pictures', {
      fields: ['text_id'],
      type: 'foreign key',
      name: 'fk_text_id',
      references: {
        table: 'texts',
        field: 'id',
      },
      onDelete: 'SET NULL',
    });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeConstraint('pictures', 'fk_text_id');

    await queryInterface.addConstraint('pictures', {
      fields: ['text_id'],
      type: 'foreign key',
      name: 'fk_text_id',
      references: {
        table: 'texts',
        field: 'id',
      },
      onDelete: 'CASCADE',
    });
  },
};
