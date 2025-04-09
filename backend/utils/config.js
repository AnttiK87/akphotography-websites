// For managing environment variables

// Get variables from dotenv file
require('dotenv').config();

// Set the server port
const PORT = process.env.PORT || 3000;

// Set the MySQL database
const MYSQL_USER = process.env.MYSQL_USER;
const MYSQL_ROOT_PASSWORD = process.env.MYSQL_ROOT_PASSWORD;
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;
const MYSQL_DATABASE = process.env.MYSQL_DATABASE;
const DB_HOST = process.env.DB_HOST;

const SECRET = process.env.SECRET;

module.exports = {
  MYSQL_USER,
  MYSQL_ROOT_PASSWORD,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
  DB_HOST,
  PORT,
  SECRET,
};
