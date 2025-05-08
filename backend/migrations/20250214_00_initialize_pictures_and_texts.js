const { DataTypes, fn } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('pictures', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      file_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      height: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      width: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      month_year: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      uploaded_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: fn('NOW'),
      },
    });
    await queryInterface.createTable('texts', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      text_fi: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      text_en: {
        type: DataTypes.TEXT,
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

    await queryInterface.addColumn('pictures', 'text_id', {
      type: DataTypes.INTEGER,
      allowNull: true,
    });

    await queryInterface.addConstraint('pictures', {
      fields: ['text_id'],
      type: 'foreign key',
      name: 'fk_text_id',
      references: {
        table: 'texts',
        field: 'id',
      },
      onDelete: 'CASCADE',
    });

    await queryInterface.addColumn('texts', 'picture_id', {
      type: DataTypes.INTEGER,
      allowNull: true,
    });

    await queryInterface.addConstraint('texts', {
      fields: ['picture_id'],
      type: 'foreign key',
      name: 'fk_picture_id',
      references: {
        table: 'pictures',
        field: 'id',
      },
      onDelete: 'CASCADE',
    });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeConstraint('pictures', 'fk_text_id');
    await queryInterface.removeColumn('pictures', 'text_id');
    await queryInterface.removeConstraint('texts', 'fk_picture_id');
    await queryInterface.removeColumn('texts', 'picture_id');
    await queryInterface.dropTable('pictures');
    await queryInterface.dropTable('texts');
  },
};
