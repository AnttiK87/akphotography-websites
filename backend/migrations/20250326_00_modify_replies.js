const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('replies', 'admin_reply', {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    })
    await queryInterface.addColumn('texts', 'text_fi', {
      type: DataTypes.TEXT,
      allowNull: true,
    })
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('replies', 'admin_reply')
  },
}
