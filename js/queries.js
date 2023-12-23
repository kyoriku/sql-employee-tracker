const inquirer = require('inquirer');
const { displayTable, validateInput, validateSalary } = require('./utils');

function viewAllDepartments(connection, startApp) {
  const query = 'SELECT * FROM department';

  connection.query(query, (error, results) => {
    if (error) {
      console.error("\x1b[31mError retrieving departments:\x1b[0m", error.message);
      startApp(connection);
    }

    if (results.length === 0) {
      console.log('\x1b[31mNo departments found.\x1b[0m');
    } else {
      const headers = ['Department ID', 'Department Name'];
      const colWidths = [15, 25];

      displayTable(results, headers, colWidths, (row) => [
        row.id,
        row.name
      ]);
    }

    startApp(connection);
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
      startApp(connection);
    }

    if (results.length === 0) {
      console.log('\x1b[31mNo roles found.\x1b[0m');
    } else {
      const headers = ['Role ID', 'Job Title', 'Department Name', 'Salary'];
      const colWidths = [15, 30, 25, 15];

      displayTable(results, headers, colWidths, (row) => [
        row['Role ID'],
        row['Job Title'],
        row['Department Name'],
        row['Salary']
      ]);
    }

    startApp(connection);
  });
}

function viewAllEmployees(connection, startApp) {
  const query = `
    SELECT
      employee.id AS 'Employee ID',
      employee.first_name AS 'First Name',
      employee.last_name AS 'Last Name',
      role.title AS 'Job Title',
      department.name AS 'Department Name',
      role.salary AS 'Salary',
      CONCAT(manager.first_name, ' ', manager.last_name) AS 'Manager'
    FROM
      employee
    LEFT JOIN
      employee AS manager ON employee.manager_id = manager.id
    LEFT JOIN
      role ON employee.role_id = role.id
    LEFT JOIN
      department ON role.department_id = department.id
  `;

  connection.query(query, (error, results) => {
    if (error) {
      console.error('\x1b[31mError retrieving employees:\x1b[0m', error.message);
      startApp(connection);
    }

    if (results.length === 0) {
      console.log('\x1b[31mNo employees found.\x1b[0m');
    } else {
      const headers = ['Employee ID', 'First Name', 'Last Name', 'Job Title', 'Department Name', 'Salary', 'Manager'];
      const colWidths = [15, 15, 15, 30, 25, 15, 20];

      displayTable(results, headers, colWidths, (row) => [
        row['Employee ID'],
        row['First Name'],
        row['Last Name'],
        row['Job Title'],
        row['Department Name'],
        row['Salary'],
        row['Manager'] || 'null'
      ]);
    }

    startApp(connection);
  });
}

function addDepartment(connection, startApp) {
  inquirer
    .prompt({
      type: 'input',
      name: 'name',
      message: 'Enter the name of the new department:',
      validate: (input) => validateInput(input, '\x1b[31mPlease enter a valid department name.\x1b[0m')
    })
    .then((answer) => {
      const sql = 'INSERT INTO department (name) VALUES (?)';
      const values = [answer.name];

      connection.query(sql, values, (error) => {
        if (error) {
          console.error('\x1b[31mError adding department:\x1b[0m', error.message);
        } else {
          console.log('\x1b[32mDepartment added successfully!\x1b[0m');
        }
        startApp(connection);
      });
    })
    .catch((error) => {
      console.error('\x1b[31mError in inquirer prompt:\x1b[0m', error.message);
      startApp(connection);
    });
}

function addRole(connection, startApp) {
  const query = 'SELECT * FROM department';

  connection.query(query, (error, results) => {
    if (error) {
      console.error('\x1b[31mError retrieving department data:\x1b[0m', error.message);
      startApp(connection);
    }

    const departmentChoices = results.map((department) => ({ name: department.name }));

    inquirer
      .prompt([
        {
          type: 'input',
          name: 'title',
          message: 'Enter the title of the new role:',
          validate: (input) => validateInput(input, '\x1b[31mPlease enter a valid role title.\x1b[0m')
        },
        {
          type: 'input',
          name: 'salary',
          message: 'Enter the salary for the new role:',
          validate: (input) => validateSalary(input, '\x1b[31mPlease enter a valid salary.\x1b[0m'),
        },
        {
          type: 'list',
          name: 'department',
          message: 'Select the department for the new role:',
          choices: departmentChoices,
        },
      ])
      .then((answers) => {
        const selectedDepartment = results.find((department) => department.name === answers.department);

        const sql = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
        const values = [
          answers.title, 
          answers.salary, 
          selectedDepartment.id
        ];

        connection.query(sql, values, (error) => {
          if (error) {
            console.error('\x1b[31mError adding role:\x1b[0m', error.message);
          } else {
            console.log("\x1b[32mRole added successfully!\x1b[0m");
          }
          startApp(connection);
        });
      })
      .catch((error) => {
        console.error('\x1b[31mError in inquirer prompt:\x1b[0m', error.message);
        startApp(connection);
      });
  });
}

function addEmployee(connection, startApp) {
  const rolesQuery = 'SELECT id, title FROM role';
  const employeesQuery = 'SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee';

  connection.query(rolesQuery, (error, roleResults) => {
    if (error) {
      console.error('\x1b[31mError retrieving role data:\x1b[0m', error.message);
      startApp(connection);
    }

    const roles = roleResults.map(({ id, title }) => ({
      name: title,
      value: id,
    }));

    connection.query(employeesQuery, (error, employeeResults) => {
      if (error) {
        console.error('\x1b[31mError retrieving employee data:\x1b[0m', error.message);
        startApp(connection);
      }

      const managers = employeeResults.map(({ id, name }) => ({
        name,
        value: id,
      }));

      inquirer
        .prompt([
          {
            type: 'input',
            name: 'firstName',
            message: "Enter the employee's first name:",
            validate: (input) => validateInput(input, '\x1b[31mPlease enter a valid first name.\x1b[0m'),
          },
          {
            type: 'input',
            name: 'lastName',
            message: "Enter the employee's last name:",
            validate: (input) => validateInput(input, '\x1b[31mPlease enter a valid last name.\x1b[0m'),
          },
          {
            type: 'list',
            name: 'roleId',
            message: 'Select the employee role:',
            choices: roles,
          },
          {
            type: 'list',
            name: 'managerId',
            message: 'Select the employee manager:',
            choices: [...managers, { name: 'None', value: null }],
          },
        ])
        .then((answers) => {
          const sql = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
          const values = [
            answers.firstName,
            answers.lastName,
            answers.roleId,
            answers.managerId,
          ];

          connection.query(sql, values, (error) => {
            if (error) {
              console.error('\x1b[31mError adding employee:\x1b[0m', error.message);
            } else {
              console.log('\x1b[32mEmployee added successfully!\x1b[0m');
            }
            startApp(connection);
          });
        })
        .catch((error) => {
          console.error('\x1b[31mError in inquirer prompt:\x1b[0m', error.message);
          startApp(connection);
        });
    });
  });
}

module.exports = {
  viewAllDepartments,
  viewAllRoles,
  viewAllEmployees,
  addDepartment,
  addRole,
  addEmployee,
}
