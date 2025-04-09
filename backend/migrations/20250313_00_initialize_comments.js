const { DataTypes, fn } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('comments', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
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
    });

    await queryInterface.addColumn('pictures', 'comment_id', {
      type: DataTypes.INTEGER,
      allowNull: true,
    });

    await queryInterface.addConstraint('pictures', {
      fields: ['comment_id'],
      type: 'foreign key',
      name: 'fk_comment_id',
      references: {
        table: 'comments',
        field: 'id',
      },
      onDelete: 'CASCADE',
    });

    await queryInterface.addColumn('comments', 'picture_id', {
      type: DataTypes.INTEGER,
      allowNull: true,
    });

    await queryInterface.addConstraint('comments', {
      fields: ['picture_id'],
      type: 'foreign key',
      name: 'fk_comments_picture_id',
      references: {
        table: 'pictures',
        field: 'id',
      },
      onDelete: 'CASCADE',
    });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeConstraint('pictures', 'fk_comment_id');
    await queryInterface.removeColumn('pictures', 'comment_id');
    await queryInterface.removeConstraint('comments', 'fk_comment_picture_id');
    await queryInterface.removeColumn('comments', 'comment_picture_id');
    await queryInterface.dropTable('comments');
  },
};
