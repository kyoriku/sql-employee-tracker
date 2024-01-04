// Import the inquirer library for handling command-line prompts
const inquirer = require('inquirer');

// Function to remove a department from the database
function deleteDepartment(connection, startApp) {
  const departmentsQuery = 'SELECT * FROM department';

  connection.query(departmentsQuery, (error, departmentResults) => {
    if (error) {
      console.error('\x1b[31mError querying departments:\x1b[0m', error.message);
      return startApp(connection);
    }

    if (departmentResults.length === 0) {
      console.log('\x1b[31mNo departments found.\x1b[0m');
      return startApp(connection);
    }

    inquirer
      .prompt({
        type: 'list',
        name: 'selectedDepartment',
        message: 'Select a department to delete:',
        choices: departmentResults.map((department) => department.name),
      })
      .then((answers) => {
        const selectedDepartment = departmentResults.find(
          (department) => department.name === answers.selectedDepartment
        );

        if (!selectedDepartment) {
          console.log('\x1b[31mInvalid department selected. Please try again.\x1b[0m');
          return startApp(connection);
        }

        const deleteQuery = 'DELETE FROM department WHERE id = ?';
        connection.query(deleteQuery, [selectedDepartment.id], (error) => {
          if (error) {
            console.error('\x1b[31mError deleting department:\x1b[0m', error.message);
          } else {
            console.log(`\x1b[32mDepartment "${answers.selectedDepartment}" deleted successfully!\x1b[0m`);
          }

          return startApp(connection);
        });
      })
      .catch((error) => {
        console.error('\x1b[31mError in inquirer prompt:\x1b[0m', error.message);
        return startApp(connection);
      });
  });
}

// Function to remove a role from the database
function deleteRole(connection, startApp) {
  const rolesQuery = 'SELECT * FROM role';

  connection.query(rolesQuery, (error, roleResults) => {
    if (error) {
      console.error('\x1b[31mError querying roles:\x1b[0m', error.message);
      return startApp(connection);
    }

    if (roleResults.length === 0) {
      console.log('\x1b[31mNo roles found.\x1b[0m');
      return startApp(connection);
    }

    inquirer
      .prompt({
        type: 'list',
        name: 'selectedRole',
        message: 'Select a role to delete:',
        choices: roleResults.map((role) => role.title),
      })
      .then((answers) => {
        const selectedRole = roleResults.find(
          (role) => role.title === answers.selectedRole
        );

        if (!selectedRole) {
          console.log('\x1b[31mInvalid role selected. Please try again.\x1b[0m');
          return startApp(connection);
        }

        const deleteQuery = 'DELETE FROM role WHERE id = ?';
        connection.query(deleteQuery, [selectedRole.id], (error) => {
          if (error) {
            console.error('\x1b[31mError deleting role:\x1b[0m', error.message);
          } else {
            console.log(`\x1b[32mRole "${answers.selectedRole}" deleted successfully!\x1b[0m`);
          }

          return startApp(connection);
        });
      })
      .catch((error) => {
        console.error('\x1b[31mError in inquirer prompt:\x1b[0m', error.message);
        return startApp(connection);
      });
  });
}

// Function to remove an employee from the database
function deleteEmployee(connection, startApp) {
  const employeesQuery = 'SELECT * FROM employee';

  connection.query(employeesQuery, (error, employeeResults) => {
    if (error) {
      console.error('\x1b[31mError querying employees:\x1b[0m', error.message);
      return startApp(connection);
    }

    if (employeeResults.length === 0) {
      console.log('\x1b[31mNo employees found.\x1b[0m');
      return startApp(connection);
    }

    inquirer
      .prompt({
        type: 'list',
        name: 'selectedEmployee',
        message: 'Select an employee to delete:',
        choices: employeeResults.map((employee) => `${employee.first_name} ${employee.last_name}`),
      })
      .then((answers) => {
        const selectedEmployee = employeeResults.find(
          (employee) => `${employee.first_name} ${employee.last_name}` === answers.selectedEmployee
        );

        if (!selectedEmployee) {
          console.log('\x1b[31mInvalid employee selected. Please try again.\x1b[0m');
          return startApp(connection);
        }

        const deleteQuery = 'DELETE FROM employee WHERE id = ?';
        connection.query(deleteQuery, [selectedEmployee.id], (error) => {
          if (error) {
            console.error('\x1b[31mError deleting employee:\x1b[0m', error.message);
          } else {
            console.log(`\x1b[32mEmployee "${answers.selectedEmployee}" deleted successfully!\x1b[0m`);
          }

          return startApp(connection);
        });
      })
      .catch((error) => {
        console.error('\x1b[31mError in inquirer prompt:\x1b[0m', error.message);
        return startApp(connection);
      });
  });
}

// Export the functions for use in the 'app.js' file
module.exports = { 
  deleteDepartment,
  deleteRole,
  deleteEmployee
}