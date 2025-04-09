const { DataTypes, fn } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('replies', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      reply: {
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
      picture_id: {
        type: DataTypes.INTEGER,
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

    await queryInterface.addColumn('comments', 'reply_id', {
      type: DataTypes.INTEGER,
      allowNull: true,
    });

    await queryInterface.addConstraint('comments', {
      fields: ['reply_id'],
      type: 'foreign key',
      name: 'fk_reply_id',
      references: {
        table: 'replies',
        field: 'id',
      },
      onDelete: 'CASCADE',
    });

    await queryInterface.addColumn('replies', 'comment_id', {
      type: DataTypes.INTEGER,
      allowNull: true,
    });

    await queryInterface.addConstraint('replies', {
      fields: ['comment_id'],
      type: 'foreign key',
      name: 'fk_reply_comment_id',
      references: {
        table: 'comments',
        field: 'id',
      },
      onDelete: 'CASCADE',
    });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeConstraint('comments', 'fk_reply_id');
    await queryInterface.removeColumn('comments', 'reply_id');
    await queryInterface.removeConstraint('replies', 'fk_reply_comment_id');
    await queryInterface.removeColumn('replies', 'comment_id');
    await queryInterface.dropTable('replies');
  },
};
