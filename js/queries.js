const inquirer = require('inquirer');
const Table = require('cli-table3');

function viewAllDepartments(connection, startApp) {
  const query = "SELECT * FROM department";

  connection.query(query, (error, results) => {
    if (error) {
      console.error("\x1b[31mError retrieving departments:\x1b[0m", error.message);
      return startApp.call(this, connection);
    }

    if (results.length === 0) {
      console.log("\x1b[31mNo departments found.\x1b[0m");
    } else {
      const headers = ['Department ID', 'Department Name'];
      const colWidths = [15, 20];

      displayTable(results, headers, colWidths, (row) => [row.id, row.name]);
    }

    startApp.call(this, connection);
  });
}

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

module.exports = {
  viewAllDepartments,
}