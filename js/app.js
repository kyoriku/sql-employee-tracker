const inquirer = require('inquirer');
const {
  viewAllDepartments,
  viewAllRoles,
  viewAllEmployees,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole,
  updateEmployeeManager,
  viewEmployeesByManager,
  viewEmployeesByDepartment,
  deleteDepartment,
  deleteRole,
  deleteEmployee,
  viewDepartmentBudget,
} = require('./queries');

function startApp(connection) {
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
      switch (selected.action) {
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
        case 'Exit':
          console.log('\x1b[32mGoodbye!\x1b[0m');
          process.exit();
      }
    })
    .catch((error) => {
      console.error('\x1b[31mError encountered during user interaction:\x1b[0m', error.message);
      startApp(connection)
    });
}

module.exports = {
  startApp,
};
