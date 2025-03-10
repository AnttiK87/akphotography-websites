const { DataTypes, fn } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('ratings', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      rating: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      user_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: fn('NOW'),
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: fn('NOW'),
      },
    })

    await queryInterface.addColumn('pictures', 'rating_id', {
      type: DataTypes.INTEGER,
      allowNull: true,
    })

    // Lisätään ulkoinen avain -rajoite
    await queryInterface.addConstraint('pictures', {
      fields: ['rating_id'],
      type: 'foreign key',
      name: 'fk_rating_id',
      references: {
        table: 'ratings',
        field: 'id',
      },
      onDelete: 'CASCADE',
    })

    await queryInterface.addColumn('ratings', 'picture_id', {
      type: DataTypes.INTEGER,
      allowNull: true,
    })

    await queryInterface.addConstraint('ratings', {
      fields: ['picture_id'],
      type: 'foreign key',
      name: 'fk_ratings_picture_id',
      references: {
        table: 'pictures',
        field: 'id',
      },
      onDelete: 'CASCADE',
    })
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeConstraint('pictures', 'fk_rating_id')
    await queryInterface.removeColumn('pictures', 'rating_id')
    await queryInterface.removeConstraint('ratings', 'fk_picture_id')
    await queryInterface.removeColumn('ratings', 'picture_id')
    await queryInterface.dropTable('ratings')
  },
}
