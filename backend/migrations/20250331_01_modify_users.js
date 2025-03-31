const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('users', 'last_login', {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    })
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('users', 'last_login')
  },
}
