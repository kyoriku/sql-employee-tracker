const inquirer = require('inquirer');
const queries = require('./queries');

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
          queries.viewAllDepartments.call(this, connection, startApp);
          break;
        case 'View all roles':
          queries.viewAllRoles.call(this, connection, startApp);
          break;
        case 'View all employees':
          queries.viewAllEmployees.call(this, connection, startApp);
          break;
        case 'Add a department':
          queries.addDepartment.call(this, connection, startApp);
          break;
        case 'Add a role':
          queries.addRole.call(this, connection, startApp);
          break;
        case 'Add an employee':
          queries.addEmployee.call(this, connection, startApp);
          break;
        case 'Update an employee role':
          queries.updateEmployeeRole.call(this, connection, startApp);
          break;
        case 'Update employee managers':
          queries.updateEmployeeManager.call(this, connection, startApp);
          break;
        case 'View employees by manager':
          queries.viewEmployeesByManager.call(this, connection, startApp);
          break;
        case 'View employees by department':
          queries.viewEmployeesByDepartment.call(this, connection, startApp);
          break;
        case 'Delete a department':
          queries.deleteDepartment.call(this, connection, startApp);
          break;
        case 'Delete a role':
          queries.deleteRole.call(this, connection, startApp);
          break;
        case 'Delete an employee':
          queries.deleteEmployee.call(this, connection, startApp);
          break;
        case 'View total utilized budget of a department':
          queries.viewDepartmentBudget.call(this, connection, startApp);
          break;
        case 'Exit':
          console.log('\x1b[32mGoodbye!\x1b[0m');
          process.exit();
      }
    })
    .catch((error) => {
      console.error('\x1b[31mError encountered during user interaction:\x1b[0m', error.message);
      return startApp(connection)
    });
}

module.exports = {
  startApp,
};
