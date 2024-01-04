// Import the inquirer library for handling command-line prompts
const inquirer = require('inquirer');

// Function to update an employees role in the database
function updateEmployeeRole(connection, startApp) {
  const employeesQuery = `
    SELECT
      employee.id,
      employee.first_name,
      employee.last_name,
      role.title
    FROM
      employee
    LEFT JOIN
      role ON employee.role_id = role.id
  `;
  const rolesQuery = 'SELECT * FROM role';

  connection.query(employeesQuery, (error, employeeResults) => {
    if (error) {
      console.error('\x1b[31mError retrieving employee data:\x1b[0m', error.message);
      return startApp(connection);
    }

    if (employeeResults.length === 0) {
      console.log('\x1b[31mNo employees available. Please add an employee first.\x1b[0m');
      return startApp(connection);
    }

    connection.query(rolesQuery, (error, roleResults) => {
      if (error) {
        console.error('\x1b[31mError retrieving role data:\x1b[0m', error.message);
        return startApp(connection);
      }

      if (roleResults.length === 0) {
        console.log('\x1b[31mNo roles available. Please add a role first.\x1b[0m');
        return startApp(connection);
      }

      inquirer
        .prompt([
          {
            type: 'list',
            name: 'employee',
            message: 'Select the employee to update:',
            choices: employeeResults.map((employee) => `${employee.first_name} ${employee.last_name}`),
          },
          {
            type: 'list',
            name: 'role',
            message: 'Select the new role:',
            choices: roleResults.map((role) => role.title),
          },
        ])
        .then((answers) => {
          const selectedEmployee = employeeResults.find((employee) =>
            `${employee.first_name} ${employee.last_name}` === answers.employee
          );

          const selectedRole = roleResults.find((role) =>
            role.title === answers.role
          );

          if (!selectedEmployee || !selectedRole) {
            console.log('\x1b[31mInvalid employee or role selected. Please try again.\x1b[0m');
            return startApp(connection);
          }

          const query = 'UPDATE employee SET role_id = ? WHERE id = ?';
          connection.query(query, [selectedRole.id, selectedEmployee.id], (error) => {
            if (error) {
              console.error('\x1b[31mError updating employee role:\x1b[0m', error.message);
            } else {
              console.log('\x1b[32mEmployee role updated successfully!\x1b[0m');
            }
            return startApp(connection);
          });
        })
        .catch((error) => {
          console.error('\x1b[31mError in inquirer prompt:\x1b[0m', error.message);
          return startApp(connection);
        });
    });
  });
}

// Function to update an employees manager in the database
function updateEmployeeManager(connection, startApp) {
  const employeesQuery = 'SELECT id, first_name, last_name FROM employee';

  connection.query(employeesQuery, (error, employeeResults) => {
    if (error) {
      console.error('\x1b[31mError retrieving employee data:\x1b[0m', error.message);
      return startApp(connection);
    }

    if (employeeResults.length === 0) {
      console.log('\x1b[31mNo employees available. Please add an employee first.\x1b[0m');
      return startApp(connection);
    }

    const employeeChoices = employeeResults.map((employee) => `${employee.first_name} ${employee.last_name}`);

    inquirer
      .prompt([
        {
          type: 'list',
          name: 'employeeName',
          message: 'Select the employee to update manager:',
          choices: employeeChoices,
        },
        {
          type: 'list',
          name: 'managerName',
          message: 'Select the new manager:',
          choices: [...employeeChoices, 'None'],
        },
      ])
      .then((answers) => {
        const selectedEmployee = employeeResults.find((employee) =>
          `${employee.first_name} ${employee.last_name}` === answers.employeeName
        );

        const selectedManager = answers.managerName === 'None' ?
          null : employeeResults.find((employee) =>
            `${employee.first_name} ${employee.last_name}` === answers.managerName
          );

        if (!selectedEmployee) {
          console.log('\x1b[31mInvalid employee selected. Please try again.\x1b[0m');
        } else {
          const updateQuery = 'UPDATE employee SET manager_id = ? WHERE id = ?';
          const updateValues = [selectedManager ? selectedManager.id : null, selectedEmployee.id];

          connection.query(updateQuery, updateValues, (error) => {
            if (error) {
              console.error('\x1b[31mError updating employee manager:\x1b[0m', error.message);
            } else {
              console.log('\x1b[32mEmployee manager updated successfully!\x1b[0m');
            }
            return startApp(connection);
          });
        }
      })
      .catch((error) => {
        console.error('\x1b[31mError in inquirer prompt:\x1b[0m', error.message);
        return startApp(connection);
      });
  });
}

// Export the functions for use in the 'app.js' file
module.exports = {
  updateEmployeeRole,
  updateEmployeeManager
}