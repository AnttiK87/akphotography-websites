const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('pictures', 'view_count', {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('pictures', 'view_count');
  },
};
