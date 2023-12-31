// Import the inquirer library for handling command-line prompts
const inquirer = require('inquirer');

// Import functions for viewing data from the 'dataView' module
const { 
  viewAllDepartments,
  viewAllRoles,
  viewAllEmployees,
  viewEmployeesByManager,
  viewEmployeesByDepartment,
  viewDepartmentBudget
} = require('./dataView');

// Import functions for adding data from the 'dataAdd' module
const { 
  addDepartment, 
  addRole, 
  addEmployee 
} = require('./dataAdd');

// Import functions for updating data from the 'dataUpdate' module
const { 
  updateEmployeeRole, 
  updateEmployeeManager 
} = require('./dataUpdate');

// Import functions for deleting data from the 'dataDelete' module
const { 
  deleteDepartment, 
  deleteRole, 
  deleteEmployee 
} = require('./dataDelete');

// Function to start the application, taking a connection object as a parameter
function startApp(connection) {
  // Prompt the user with a list of actions to choose from
  inquirer
    .prompt({
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Update employee managers',
        'View employees by manager',
        'View employees by department',
        'Delete a department',
        'Delete a role',
        'Delete an employee',
        'View total utilized budget of a department',
        'Exit',
      ],
    })
    .then((selected) => {
      // Use a switch statement to handle different user-selected actions
      switch (selected.action) {
        // Call corresponding query functions based on the user's selection
        case 'View all departments':
          viewAllDepartments(connection, startApp);
          break;
        case 'View all roles':
          viewAllRoles(connection, startApp);
          break;
        case 'View all employees':
          viewAllEmployees(connection, startApp);
          break;
        case 'Add a department':
          addDepartment(connection, startApp);
          break;
        case 'Add a role':
          addRole(connection, startApp);
          break;
        case 'Add an employee':
          addEmployee(connection, startApp);
          break;
        case 'Update an employee role':
          updateEmployeeRole(connection, startApp);
          break;
        case 'Update employee managers':
          updateEmployeeManager(connection, startApp);
          break;
        case 'View employees by manager':
          viewEmployeesByManager(connection, startApp);
          break;
        case 'View employees by department':
          viewEmployeesByDepartment(connection, startApp);
          break;
        case 'Delete a department':
          deleteDepartment(connection, startApp);
          break;
        case 'Delete a role':
          deleteRole(connection, startApp);
          break;
        case 'Delete an employee':
          deleteEmployee(connection, startApp);
          break;
        case 'View total utilized budget of a department':
          viewDepartmentBudget(connection, startApp);
          break;
        // If Exit is selected, log a goodbye message to the console and exit the process
        case 'Exit':
          console.log('\x1b[32mGoodbye!\x1b[0m');
          process.exit();
      }
    })
    // Handle any errors that occur during the inquirer prompt or user interaction
    .catch((error) => {
      // Log an error message in red, indicating that an error was encountered during user interaction
      console.error('\x1b[31mError encountered during user interaction:\x1b[0m', error.message);

      // Call the startApp function to return to the main menu
      return startApp(connection);
    });

}

// Export the startApp function for use in the 'server.js' file
module.exports = { startApp };
