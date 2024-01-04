// Import the mysql2 library to interact with MySQL databases
const mysql = require('mysql2');

// Import the startApp function from the 'app.js' file
const { startApp } = require('./js/app');

// Load environment variables from the '.env' file using the dotenv module
require('dotenv').config();

// Create a MySQL connection using the provided credentials from environment variables
const connection = mysql.createConnection({
  host: process.env.DB_HOST,       // Database host address
  user: process.env.DB_USER,       // Database username
  password: process.env.DB_PASS,   // Database password
  database: process.env.DB_NAME    // Database name
});

// Establish a connection to the MySQL database
connection.connect((error) => {
  // Check if there is an error during the connection process
  if (error) {
    // If an error occurs, log an error message in red to the console and exit the application
    console.error('\x1b[31mError connecting to the database:\x1b[0m', error.message);
    return;
  }

  // If the connection is successful, log a success message in green to the console
  console.log('\x1b[32mConnected to the Employee Tracker database!\x1b[0m');

  // Start the application by calling the startApp function and passing the established database connection as an argument
  // This allows various parts of the application to perform database operations using the provided connection
  startApp(connection);
});
