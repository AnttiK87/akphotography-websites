const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('keywords', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      keyword: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    })

    await queryInterface.createTable('picture_keywords', {
      picture_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'pictures',
          key: 'id',
        },
        onDelete: 'CASCADE',
        primaryKey: true,
      },
      keyword_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'keywords',
          key: 'id',
        },
        onDelete: 'CASCADE',
        primaryKey: true,
      },
    })
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('picture_keywords')
    await queryInterface.dropTable('keywords')
  },
}
