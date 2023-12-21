const mysql = require('mysql2');
const dotenv = require('dotenv');
const { startApp } = require('./app');

dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

connection.connect((error) => {
  if (error) {
    console.error('\x1b[31m Error connecting to the database:\x1b[0m', error.message);
    return;
  }

  console.log('\x1b[32m Connected to the database\x1b[0m');
  startApp(connection);
});
