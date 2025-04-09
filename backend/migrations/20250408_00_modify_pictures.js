const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('pictures', 'url_thumbnail', {
      type: DataTypes.STRING,
      allowNull: true,
    })
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('pictures', 'url_thumbnail')
  },
}
