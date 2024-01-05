// Import the inquirer library for handling command-line prompts
const inquirer = require('inquirer');

// Function to update an employee's role in the database
function updateEmployeeRole(connection, startApp) {
  // SQL query to select specific columns from the employee and role tables using a LEFT JOIN
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
  // SQL query to select all columns from the role table
  const rolesQuery = 'SELECT * FROM role';

  // Execute the first SQL query to retrieve employee data with their current roles
  connection.query(employeesQuery, (error, employeeResults) => {
    // Check for errors during the database query
    if (error) {
      // Log an error message in red if there is an error retrieving employee data
      console.error('\x1b[31mError retrieving employee data:\x1b[0m', error.message);
      // Call the startApp function to return to the main menu
      return startApp(connection);
    }

    // Check if there are no employees available
    if (employeeResults.length === 0) {
      // Log a message in red indicating that no employees are available
      console.log('\x1b[31mNo employees available. Please add an employee first.\x1b[0m');
      // Call the startApp function to return to the main menu
      return startApp(connection);
    }

    // Execute the second SQL query to retrieve all roles
    connection.query(rolesQuery, (error, roleResults) => {
      // Check for errors during the database query
      if (error) {
        // Log an error message in red if there is an error retrieving role data
        console.error('\x1b[31mError retrieving role data:\x1b[0m', error.message);
        // Call the startApp function to return to the main menu
        return startApp(connection);
      }

      // Check if there are no roles available
      if (roleResults.length === 0) {
        // Log a message in red indicating that no roles are available
        console.log('\x1b[31mNo roles available. Please add a role first.\x1b[0m');
        // Call the startApp function to return to the main menu
        return startApp(connection);
      }

      // Use the inquirer library to prompt the user to select an employee and a new role
      inquirer
        .prompt([
          {
            type: 'list',
            name: 'employee',
            message: 'Select the employee to update:',
            // Provide a list of employee names as choices
            choices: employeeResults.map((employee) => `${employee.first_name} ${employee.last_name}`),
          },
          {
            type: 'list',
            name: 'role',
            message: 'Select the new role:',
            // Provide a list of role titles as choices
            choices: roleResults.map((role) => role.title),
          },
        ])
        // Handle the user's input using a promise
        .then((answers) => {
          // Find the selected employee object based on the user's choice
          const selectedEmployee = employeeResults.find((employee) =>
          // Use template literals to create a full name string in the format "first_name last_name"
            `${employee.first_name} ${employee.last_name}` === answers.employee
          );

          // Find the selected role object based on the user's choice
          const selectedRole = roleResults.find((role) =>
            role.title === answers.role
          );

          // Check if a valid employee or role is selected
          if (!selectedEmployee || !selectedRole) {
            // Log an error message in red if the selected employee or role is invalid
            console.log('\x1b[31mInvalid employee or role selected. Please try again.\x1b[0m');
            // Call the startApp function to return to the main menu
            return startApp(connection);
          }

          // SQL query to update the employee's role in the database
          const query = 'UPDATE employee SET role_id = ? WHERE id = ?';
          // Execute the SQL query to update the employee's role
          connection.query(query, [selectedRole.id, selectedEmployee.id], (error) => {
            // Check for errors during the database query
            if (error) {
              // Log an error message in red if there is an error updating the employee's role
              console.error('\x1b[31mError updating employee role:\x1b[0m', error.message);
            } else {
              // Log a success message in green if the employee's role is updated successfully
              console.log('\x1b[32mEmployee role updated successfully!\x1b[0m');
            }

            // Call the startApp function to return to the main menu after the update is complete
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
  });
}

// Function to update an employee's manager in the database
function updateEmployeeManager(connection, startApp) {
  // SQL query to select specific columns from the employee table
  const employeesQuery = 'SELECT id, first_name, last_name FROM employee';

  // Execute the SQL query to retrieve employee data
  connection.query(employeesQuery, (error, employeeResults) => {
    // Check for errors during the database query
    if (error) {
      // Log an error message in red if there is an error retrieving employee data
      console.error('\x1b[31mError retrieving employee data:\x1b[0m', error.message);
      // Call the startApp function to return to the main menu
      return startApp(connection);
    }

    // Check if there are no employees available
    if (employeeResults.length === 0) {
      // Log a message in red indicating that no employees are available
      console.log('\x1b[31mNo employees available. Please add an employee first.\x1b[0m');
      // Call the startApp function to return to the main menu
      return startApp(connection);
    }

    // Create an array of employee choices in the format "first_name last_name"
    const employeeChoices = employeeResults.map((employee) => `${employee.first_name} ${employee.last_name}`);

    // Use the inquirer library to prompt the user to select an employee and a new manager
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'employeeName',
          message: 'Select the employee to update manager:',
          // Provide a list of employee choices as options
          choices: employeeChoices,
        },
        {
          type: 'list',
          name: 'managerName',
          message: 'Select the new manager:',
          // Provide a list of employee choices plus the option 'None'
          choices: [...employeeChoices, 'None'],
        },
      ])
      // Handle the user's input using a promise
      .then((answers) => {
        // Find the selected employee object based on the user's choice
        const selectedEmployee = employeeResults.find((employee) =>
          // Use template literals to create a full name string in the format "first_name last_name"
          `${employee.first_name} ${employee.last_name}` === answers.employeeName
        );

        // Find the selected manager object based on the user's choice
        const selectedManager = answers.managerName === 'None' ?
          // If the user selected 'None', set the selected manager to null
          null : employeeResults.find((employee) =>
            // Use template literals to create a full name string in the format "first_name last_name"
            `${employee.first_name} ${employee.last_name}` === answers.managerName
          );

        // Check if a valid employee is selected
        if (!selectedEmployee) {
          // Log an error message in red if the selected employee is invalid
          console.log('\x1b[31mInvalid employee selected. Please try again.\x1b[0m');
        } else {
          // SQL query to update the employee's manager in the database
          const updateQuery = 'UPDATE employee SET manager_id = ? WHERE id = ?';
          // Values to be updated in the query (manager_id and employee_id)
          const updateValues = [selectedManager ? selectedManager.id : null, selectedEmployee.id];

          // Execute the SQL query to update the employee's manager
          connection.query(updateQuery, updateValues, (error) => {
            // Check for errors during the database query
            if (error) {
              // Log an error message in red if there is an error updating the employee's manager
              console.error('\x1b[31mError updating employee manager:\x1b[0m', error.message);
            } else {
              // Log a success message in green if the employee's manager is updated successfully
              console.log('\x1b[32mEmployee manager updated successfully!\x1b[0m');
            }

            // Call the startApp function to return to the main menu after the update is complete
            return startApp(connection);
          });
        }
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
  updateEmployeeRole,
  updateEmployeeManager
}
