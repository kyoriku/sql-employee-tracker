// Import the inquirer library for handling command-line prompts
const inquirer = require('inquirer');

// Function to remove a department from the database
function deleteDepartment(connection, startApp) {
  // SQL query to select all columns from the department table
  const departmentsQuery = 'SELECT * FROM department';

  // Execute the SQL query to retrieve all departments
  connection.query(departmentsQuery, (error, departmentResults) => {
    // Check for errors during the database query
    if (error) {
      // Log an error message in red if there is an error querying departments
      console.error('\x1b[31mError querying departments:\x1b[0m', error.message);
      // Call the startApp function to return to the main menu
      return startApp(connection);
    }

    // Check if there are no departments found in the database
    if (departmentResults.length === 0) {
      // Log a message in red indicating that no departments were found
      console.log('\x1b[31mNo departments found.\x1b[0m');
      // Call the startApp function to return to the main menu
      return startApp(connection);
    }

    // Use the inquirer library to prompt the user to select a department to delete
    inquirer
      .prompt({
        type: 'list',
        name: 'selectedDepartment',
        message: 'Select a department to delete:',
        // Provide a list of department names as choices
        choices: departmentResults.map((department) => department.name),
      })
      // Handle the user's input using a promise
      .then((answers) => {
        // Find the selected department object based on the user's choice
        const selectedDepartment = departmentResults.find(
          (department) => department.name === answers.selectedDepartment
        );

        // Check if a valid department is selected
        if (!selectedDepartment) {
          // Log an error message in red if the selected department is invalid
          console.log('\x1b[31mInvalid department selected. Please try again.\x1b[0m');
          // Call the startApp function to return to the main menu
          return startApp(connection);
        }

        // SQL query to delete the selected department from the department table
        const deleteQuery = 'DELETE FROM department WHERE id = ?';
        
        // Execute the SQL query to delete the department
        connection.query(deleteQuery, [selectedDepartment.id], (error) => {
          // Check for errors during the database query
          if (error) {
            // Log an error message in red if there is an error deleting the department
            console.error('\x1b[31mError deleting department:\x1b[0m', error.message);
          } else {
            // Log a success message in green if the department is deleted successfully
            console.log(`\x1b[32mDepartment deleted successfully!\x1b[0m`);
          }

          // Call the startApp function to return to the main menu
          return startApp(connection);
        });
      })
      // Handle any errors that occur during the inquirer prompt
      .catch((error) => {
        // Log an error message in red if there is an error in the inquirer prompt
        console.error('\x1b[31mError in inquirer prompt:\x1b[0m', error.message);
        // Call the startApp function to return to the main menu
        return startApp(connection);
      });
  });
}

// Function to remove a role from the database
function deleteRole(connection, startApp) {
  // SQL query to select all columns from the role table
  const rolesQuery = 'SELECT * FROM role';

  // Execute the SQL query to retrieve all roles
  connection.query(rolesQuery, (error, roleResults) => {
    // Check for errors during the database query
    if (error) {
      // Log an error message in red if there is an error querying roles
      console.error('\x1b[31mError querying roles:\x1b[0m', error.message);
      // Call the startApp function to return to the main menu
      return startApp(connection);
    }

    // Check if there are no roles found in the database
    if (roleResults.length === 0) {
      // Log a message in red indicating that no roles were found
      console.log('\x1b[31mNo roles found.\x1b[0m');
      // Call the startApp function to return to the main menu
      return startApp(connection);
    }

    // Use the inquirer library to prompt the user to select a role to delete
    inquirer
      .prompt({
        type: 'list',
        name: 'selectedRole',
        message: 'Select a role to delete:',
        // Provide a list of role titles as choices
        choices: roleResults.map((role) => role.title),
      })
      // Handle the user's input using a promise
      .then((answers) => {
        // Find the selected role object based on the user's choice
        const selectedRole = roleResults.find(
          (role) => role.title === answers.selectedRole
        );

        // Check if a valid role is selected
        if (!selectedRole) {
          // Log an error message in red if the selected role is invalid
          console.log('\x1b[31mInvalid role selected. Please try again.\x1b[0m');
          // Call the startApp function to return to the main menu
          return startApp(connection);
        }

        // SQL query to delete the selected role from the role table
        const deleteQuery = 'DELETE FROM role WHERE id = ?';

        // Execute the SQL query to delete the role
        connection.query(deleteQuery, [selectedRole.id], (error) => {
          // Check for errors during the database query
          if (error) {
            // Log an error message in red if there is an error deleting the role
            console.error('\x1b[31mError deleting role:\x1b[0m', error.message);
          } else {
            // Log a success message in green if the role is deleted successfully
            console.log(`\x1b[32mRole deleted successfully!\x1b[0m`);
          }

          // Call the startApp function to return to the main menu
          return startApp(connection);
        });
      })
      // Handle any errors that occur during the inquirer prompt
      .catch((error) => {
        // Log an error message in red if there is an error in the inquirer prompt
        console.error('\x1b[31mError in inquirer prompt:\x1b[0m', error.message);
        // Call the startApp function to return to the main menu
        return startApp(connection);
      });
  });
}

// Function to remove an employee from the database
function deleteEmployee(connection, startApp) {
  // SQL query to select all columns from the employee table
  const employeesQuery = 'SELECT * FROM employee';

  // Execute the SQL query to retrieve all employees
  connection.query(employeesQuery, (error, employeeResults) => {
    // Check for errors during the database query
    if (error) {
      // Log an error message in red if there is an error querying employees
      console.error('\x1b[31mError querying employees:\x1b[0m', error.message);
      // Call the startApp function to return to the main menu
      return startApp(connection);
    }

    // Check if there are no employees found in the database
    if (employeeResults.length === 0) {
      // Log a message in red indicating that no employees were found
      console.log('\x1b[31mNo employees found.\x1b[0m');
      // Call the startApp function to return to the main menu
      return startApp(connection);
    }

    // Use the inquirer library to prompt the user to select an employee to delete
    inquirer
      .prompt({
        type: 'list',
        name: 'selectedEmployee',
        message: 'Select an employee to delete:',
        // Provide a list of employee names as choices
        choices: employeeResults.map((employee) => `${employee.first_name} ${employee.last_name}`),
      })
      // Handle the user's input using a promise
      .then((answers) => {
        // Find the selected employee object based on the user's choice
        const selectedEmployee = employeeResults.find(
          (employee) => `${employee.first_name} ${employee.last_name}` === answers.selectedEmployee
        );

        // Check if a valid employee is selected
        if (!selectedEmployee) {
          // Log an error message in red if the selected employee is invalid
          console.log('\x1b[31mInvalid employee selected. Please try again.\x1b[0m');
          // Call the startApp function to return to the main menu
          return startApp(connection);
        }

        // SQL query to delete the selected employee from the employee table
        const deleteQuery = 'DELETE FROM employee WHERE id = ?';

        // Execute the SQL query to delete the employee
        connection.query(deleteQuery, [selectedEmployee.id], (error) => {
          // Check for errors during the database query
          if (error) {
            // Log an error message in red if there is an error deleting the employee
            console.error('\x1b[31mError deleting employee:\x1b[0m', error.message);
          } else {
            // Log a success message in green if the employee is deleted successfully
            console.log(`\x1b[32mEmployee deleted successfully!\x1b[0m`);
          }

          // Call the startApp function to return to the main menu
          return startApp(connection);
        });
      })
      // Handle any errors that occur during the inquirer prompt
      .catch((error) => {
        // Log an error message in red if there is an error in the inquirer prompt
        console.error('\x1b[31mError in inquirer prompt:\x1b[0m', error.message);
        // Call the startApp function to return to the main menu
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