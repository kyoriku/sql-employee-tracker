const inquirer = require('inquirer');
const Table = require('cli-table3');

function viewAllDepartments(connection, startApp) {
  const query = 'SELECT * FROM department';

  connection.query(query, (error, results) => {
    if (error) {
      console.error("\x1b[31mError retrieving departments:\x1b[0m", error.message);
      return startApp.call(this, connection);
    }

    if (results.length === 0) {
      console.log('\x1b[31mNo departments found.\x1b[0m');
    } else {
      const headers = ['Department ID', 'Department Name'];
      const colWidths = [15, 20];

      displayTable(results, headers, colWidths, (row) => [
        row.id,
        row.name
      ]);
    }

    startApp.call(this, connection);
  });
}

function viewAllRoles(connection, startApp) {
  const query = `
    SELECT
      role.id AS 'Role ID',
      role.title AS 'Job Title',
      department.name AS 'Department Name',
      role.salary AS 'Salary'
    FROM
      role
    LEFT JOIN
      department ON role.department_id = department.id
  `;

  connection.query(query, (error, results) => {
    if (error) {
      console.error('\x1b[31mError retrieving roles:\x1b[0m', error.message);
      return startApp.call(this, connection);
    }

    if (results.length === 0) {
      console.log('\x1b[31mNo roles found.\x1b[0m');
    } else {
      const headers = ['Role ID', 'Job Title', 'Department Name', 'Salary'];
      const colWidths = [15, 30, 20, 15];

      displayTable(results, headers, colWidths, (row) => [
        row['Role ID'],
        row['Job Title'],
        row['Department Name'],
        row['Salary']
      ]);
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
  viewAllRoles,
}