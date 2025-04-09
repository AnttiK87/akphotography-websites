const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('replies', 'admin_reply', {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('replies', 'admin_reply');
  },
};
