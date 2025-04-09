const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
require('dotenv').config();

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('users', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
    await queryInterface.createTable('sessions', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      active_token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      },
    });

    const adminPassword = process.env.ADMIN_PASSWORD || 'defaultPassword';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    return queryInterface.bulkInsert('users', [
      {
        name: 'admin',
        username: 'admin',
        email: 'admin@example.com',
        password_hash: hashedPassword,
        role: 'admin',
      },
    ]);
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('users');
    await queryInterface.dropTable('sessions');
  },
};
