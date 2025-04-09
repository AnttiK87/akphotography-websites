const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('replies', 'parent_reply_id', {
      type: DataTypes.INTEGER,
      allowNull: true,
    });

    await queryInterface.addConstraint('replies', {
      fields: ['parent_reply_id'],
      type: 'foreign key',
      name: 'fk_parent_reply_id',
      references: {
        table: 'replies',
        field: 'id',
      },
      onDelete: 'CASCADE',
    });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeConstraint('replies', 'fk_parent_reply_id');
    await queryInterface.removeColumn('replies', 'parent_reply_id');
  },
};
