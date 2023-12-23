const Table = require('cli-table3');

function displayTable(rows, headers, colWidths, rowFormatter) {
  const table = new Table({
    head: headers,
    colWidths: colWidths,
  });

  rows.forEach((row) => {
    table.push(rowFormatter ? rowFormatter(row) : Object.values(row));
  });

  console.log(table.toString());
}

function validateInput(input, error) {
  if (!/^[a-zA-Z\s]+$/.test(input.trim())) {
    return error;
  }
  return true;
}

function validateSalary(input, error) {
  if (input.trim() === '' || isNaN(input) || parseFloat(input) <= 0) {
    return error;
  }
  return true;
}

module.exports = {
  displayTable,
  validateInput,
  validateSalary,
};
