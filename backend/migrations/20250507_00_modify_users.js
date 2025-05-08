const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('users', 'login_time', {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('users', 'login_time');
  },
};
