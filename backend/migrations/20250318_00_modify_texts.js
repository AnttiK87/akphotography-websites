const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('texts', 'text_fi');
    await queryInterface.removeColumn('texts', 'text_en');

    await queryInterface.addColumn('texts', 'text_fi', {
      type: DataTypes.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn('texts', 'text_en', {
      type: DataTypes.TEXT,
      allowNull: true,
    });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('texts', 'text_fi');
    await queryInterface.removeColumn('texts', 'text_en');

    await queryInterface.addColumn('texts', 'text_fi', {
      type: DataTypes.TEXT,
      allowNull: false,
    });

    await queryInterface.addColumn('texts', 'text_en', {
      type: DataTypes.TEXT,
      allowNull: false,
    });
  },
};
