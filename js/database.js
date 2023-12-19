const mysql = require('mysql2');
require('dotenv').config()

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) {
    console.error('\x1b[31m Error connecting to database:\x1b[0m', err.message);
    return;
  }

  console.log('\x1b[32m Connected to the database\x1b[0m');
});

module.exports = connection;
