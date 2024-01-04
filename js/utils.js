// Import the cli-table3 library for creating tables in the command line interface
const Table = require('cli-table3');

// Function to display a table in the command line interface
function displayTable(rows, headers, colWidths, rowFormatter) {
  // Create a new instance of the Table class with specified headers and column widths
  const table = new Table({
    head: headers,
    colWidths: colWidths,
  });

  // Iterate over each row and add it to the table using the specified row formatter
  rows.forEach((row) => {
    // If a row formatter is provided, use it; otherwise, use Object.values to extract values from the row
    table.push(rowFormatter ? rowFormatter(row) : Object.values(row));
  });

  // Log the formatted table as a string to the console
  console.log(table.toString());
}

// Function to validate user input as alphabetic characters and spaces only
function validateInput(input, error) {
  // Use a regular expression to check if the input contains only alphabetic characters and spaces
  if (!/^[a-zA-Z\s]+$/.test(input.trim())) {
    // If the input is invalid, return the specified error message
    return error;
  }
  // If the input is valid, return true
  return true;
}

// Function to validate salary input as a non-empty, numeric, and positive value
function validateSalary(input, error) {
  // Check if the input is empty, not a number, or less than or equal to zero
  if (input.trim() === '' || isNaN(input) || parseFloat(input) <= 0) {
    // If the input is invalid, return the specified error message
    return error;
  }
  // If the input is valid, return true
  return true;
}

// Export the utility functions for use in the 'dataView.js' and 'dataAdd.js' files
module.exports = {
  displayTable,
  validateInput,
  validateSalary,
};
