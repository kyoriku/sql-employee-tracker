// Import the inquirer library for handling command-line prompts
const inquirer = require('inquirer');

// Import utility functions for displaying tables and input validation
const { displayTable, validateInput, validateSalary } = require('./utils');

// Function to view all departments in the database
function viewAllDepartments(connection, startApp) {
  // SQL query to select all columns from the department table
  const query = 'SELECT * FROM department';

  // Execute the SQL query using the database connection
  connection.query(query, (error, results) => {
    // Check for errors during the database query
    if (error) {
      // Log an error message in red if there is an error retrieving departments
      console.error("\x1b[31mError retrieving departments:\x1b[0m", error.message);
      // Call the startApp function to return to the main menu
      return startApp(connection);
    }

    // Check if there are no departments found in the database
    if (results.length === 0) {
      // Log a message in red indicating that no departments were found
      console.log('\x1b[31mNo departments found.\x1b[0m');
    } else {
      // If departments are found, define headers and column widths for the table
      const headers = ['Department ID', 'Department Name'];
      const colWidths = [15, 25];

      // Call the displayTable utility function to format and display the results in a table
      displayTable(results, headers, colWidths, (row) => [
        row.id,
        row.name
      ]);
    }

    // Call the startApp function to return to the main menu after displaying the departments
    return startApp(connection);
  });
}

// Function to view all roles in the database
function viewAllRoles(connection, startApp) {
  // SQL query to select specific columns from the role table
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

  // Execute the SQL query using the database connection
  connection.query(query, (error, results) => {
    // Check for errors during the database query
    if (error) {
      // Log an error message in red if there is an error retrieving roles
      console.error('\x1b[31mError retrieving roles:\x1b[0m', error.message);
      // Call the startApp function to return to the main menu
      return startApp(connection);
    }

    // Check if there are no roles found in the database
    if (results.length === 0) {
      // Log a message in red indicating that no roles were found
      console.log('\x1b[31mNo roles found.\x1b[0m');
    } else {
      // If roles are found, define headers and column widths for the table
      const headers = ['Role ID', 'Job Title', 'Department Name', 'Salary'];
      const colWidths = [15, 30, 25, 15];

      // Call the displayTable utility function to format and display the results in a table
      displayTable(results, headers, colWidths, (row) => [
        row['Role ID'],
        row['Job Title'],
        row['Department Name'],
        row['Salary']
      ]);
    }

    // Call the startApp function to return to the main menu after displaying the roles
    return startApp(connection);
  });
}

// Function to view all employees in the database
function viewAllEmployees(connection, startApp) {
  // SQL query to select specific columns from the employee table
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

  // Execute the SQL query using the database connection
  connection.query(query, (error, results) => {
    // Check for errors during the database query
    if (error) {
      // Log an error message in red if there is an error retrieving employees
      console.error('\x1b[31mError retrieving employees:\x1b[0m', error.message);
      // Call the startApp function to return to the main menu
      return startApp(connection);
    }

    // Check if there are no employees found in the database
    if (results.length === 0) {
      // Log a message in red indicating that no employees were found
      console.log('\x1b[31mNo employees found.\x1b[0m');
    } else {
      // If employees are found, define headers and column widths for the table
      const headers = ['Employee ID', 'First Name', 'Last Name', 'Job Title', 'Department Name', 'Salary', 'Manager'];
      const colWidths = [15, 15, 15, 30, 25, 15, 20];

      // Call the displayTable utility function to format and display the results in a table
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

    // Call the startApp function to return to the main menu after displaying the employees
    return startApp(connection);
  });
}

// Function to add a new department to the database
function addDepartment(connection, startApp) {
  // Use the inquirer library to prompt the user for input
  inquirer
    .prompt({
      type: 'input',
      name: 'name',
      message: 'Enter the name of the new department:',
      // Validate the input using the validateInput utility function, displaying an error message in red if invalid
      validate: (input) => validateInput(input, '\x1b[31mPlease enter a valid department name.\x1b[0m')
    })
    // Handle the user's input using a promise
    .then((answer) => {
      // SQL query to insert a new department into the department table
      const sql = 'INSERT INTO department (name) VALUES (?)';
      // Values to be inserted into the query (the department name provided by the user)
      const values = [answer.name];

      // Execute the SQL query using the database connection
      connection.query(sql, values, (error) => {
        // Check for errors during the database query
        if (error) {
          // Log an error message in red if there is an error adding the department
          console.error('\x1b[31mError adding department:\x1b[0m', error.message);
        } else {
          // Log a success message in green if the department is added successfully
          console.log('\x1b[32mDepartment added successfully!\x1b[0m');
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
}

// Function to add a new role to the database
function addRole(connection, startApp) {
  // SQL query to retrieve all departments from the department table
  const query = 'SELECT * FROM department';

  // Execute the SQL query using the database connection
  connection.query(query, (error, results) => {
    // Check for errors during the database query
    if (error) {
      // Log an error message in red if there is an error retrieving department data
      console.error('\x1b[31mError retrieving department data:\x1b[0m', error.message);
      // Call the startApp function to return to the main menu
      return startApp(connection);
    }

    // Map the department data to an array of choices for inquirer prompt
    const departmentChoices = results.map((department) => ({ name: department.name }));

    // Use inquirer to prompt the user for role information
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'title',
          message: 'Enter the title of the new role:',
          // Validate the input using the validateInput utility function, displaying an error message in red if invalid
          validate: (input) => validateInput(input, '\x1b[31mPlease enter a valid role title.\x1b[0m')
        },
        {
          type: 'input',
          name: 'salary',
          message: 'Enter the salary for the new role:',
          // Validate the input using the validateSalary utility function, displaying an error message in red if invalid
          validate: (input) => validateSalary(input, '\x1b[31mPlease enter a valid salary.\x1b[0m'),
        },
        {
          type: 'list',
          name: 'department',
          message: 'Select the department for the new role:',
          choices: departmentChoices,
        },
      ])
      // Handle the user's input using a promise
      .then((answers) => {
        // Find the selected department in the retrieved department data
        const selectedDepartment = results.find((department) =>
          department.name === answers.department
        );

        // SQL query to insert a new role into the role table
        const sql = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
        // Values to be inserted into the query (role title, salary, and department_id)
        const values = [
          answers.title,
          answers.salary,
          selectedDepartment.id
        ];

        // Execute the SQL query using the database connection
        connection.query(sql, values, (error) => {
          // Check for errors during the database query
          if (error) {
            // Log an error message in red if there is an error adding the role
            console.error('\x1b[31mError adding role:\x1b[0m', error.message);
          } else {
            // Log a success message in green if the role is added successfully
            console.log("\x1b[32mRole added successfully!\x1b[0m");
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

// Function to add a new employee to the database
function addEmployee(connection, startApp) {
  // SQL query to retrieve role data (id and title) from the role table
  const rolesQuery = 'SELECT id, title FROM role';
  // SQL query to retrieve employee data (id and concatenated name) from the employee table
  const employeesQuery = 'SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee';

  // Execute the SQL query to retrieve role data
  connection.query(rolesQuery, (error, roleResults) => {
    // Check for errors during the database query
    if (error) {
      // Log an error message in red if there is an error retrieving role data
      console.error('\x1b[31mError retrieving role data:\x1b[0m', error.message);
      // Call the startApp function to return to the main menu
      return startApp(connection);
    }

    // Map role data to an array of choices for inquirer prompt
    const roles = roleResults.map(({ id, title }) => ({
      name: title,
      value: id,
    }));

    // Execute the SQL query to retrieve employee data
    connection.query(employeesQuery, (error, employeeResults) => {
      // Check for errors during the database query
      if (error) {
        // Log an error message in red if there is an error retrieving employee data
        console.error('\x1b[31mError retrieving employee data:\x1b[0m', error.message);
        // Call the startApp function to return to the main menu
        return startApp(connection);
      }

      // Map employee data to an array of choices for inquirer prompt
      const managers = employeeResults.map(({ id, name }) => ({
        name,
        value: id,
      }));

      // Use inquirer to prompt the user for employee information
      inquirer
        .prompt([
          {
            type: 'input',
            name: 'firstName',
            message: "Enter the employee's first name:",
            // Validate the input using the validateInput utility function, displaying an error message in red if invalid
            validate: (input) => validateInput(input, '\x1b[31mPlease enter a valid first name.\x1b[0m'),
          },
          {
            type: 'input',
            name: 'lastName',
            message: "Enter the employee's last name:",
            // Validate the input using the validateInput utility function, displaying an error message in red if invalid
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
            // Provide choices for managers, including an option for 'None'
            choices: [...managers, { name: 'None', value: null }],
          },
        ])
        // Handle the user's input using a promise
        .then((answers) => {
          // SQL query to insert a new employee into the employee table
          const sql = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
          // Values to be inserted into the query (employee's first name, last name, role id, and manager id)
          const values = [
            answers.firstName,
            answers.lastName,
            answers.roleId,
            answers.managerId,
          ];

          // Execute the SQL query using the database connection
          connection.query(sql, values, (error) => {
            // Check for errors during the database query
            if (error) {
              // Log an error message in red if there is an error adding the employee
              console.error('\x1b[31mError adding employee:\x1b[0m', error.message);
            } else {
              // Log a success message in green if the employee is added successfully
              console.log('\x1b[32mEmployee added successfully!\x1b[0m');
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
  });
}

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

function viewEmployeesByManager(connection, startApp) {
  const managersQuery = `
    SELECT 
      DISTINCT CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
    FROM 
      employee 
    LEFT JOIN
      employee AS manager ON employee.manager_id = manager.id 
    WHERE 
      manager.id IS NOT NULL`;

  connection.query(managersQuery, (error, results) => {
    if (error) {
      console.error('\x1b[31mError retrieving manager data:\x1b[0m', error);
      return startApp(connection);
    }

    if (results.length === 0) {
      console.log('\x1b[31mNo managers available. Please add a manager first.\x1b[0m');
      return startApp(connection);
    }

    const managerChoices = results.map((manager) => manager.manager);

    inquirer
      .prompt({
        type: 'list',
        name: 'selectedManager',
        message: 'Select a manager:',
        choices: managerChoices,
      })
      .then((answers) => {
        const query = `
          SELECT
            employee.id AS 'Employee ID',
            employee.first_name AS 'First Name',
            employee.last_name AS 'Last Name',
            role.title AS 'Job Title',
            department.name AS 'Department Name',
            role.salary AS 'Salary'
          FROM
            employee
          LEFT JOIN
            role ON employee.role_id = role.id
          LEFT JOIN
            department ON role.department_id = department.id
          LEFT JOIN
            employee AS manager ON employee.manager_id = manager.id
          WHERE
            CONCAT(manager.first_name, ' ', manager.last_name) = ?
        `;

        connection.query(query, [answers.selectedManager], (error, results) => {
          if (error) {
            console.error('\x1b[31mError retrieving manager data:\x1b[0m', error);
            return startApp(connection);
          }

          if (results.length === 0) {
            console.log(`\x1b[31mNo employees found for manager ${answers.selectedManager}.\x1b[0m`);
          } else {
            const headers = ['Employee ID', 'First Name', 'Last Name', 'Job Title', 'Department Name', 'Salary'];
            const colWidths = [15, 15, 15, 30, 25, 15];

            displayTable(results, headers, colWidths, (row) => [
              row['Employee ID'],
              row['First Name'],
              row['Last Name'],
              row['Job Title'],
              row['Department Name'],
              row['Salary']
            ]);
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

function viewEmployeesByDepartment(connection, startApp) {
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
        message: 'Select a department to view employees:',
        choices: departmentResults.map(department => department.name),
      })
      .then((answers) => {
        const query = `
          SELECT
            employee.id AS 'Employee ID',
            employee.first_name AS 'First Name',
            employee.last_name AS 'Last Name',
            role.title AS 'Job Title',
            role.salary AS 'Salary'
          FROM
            employee
          LEFT JOIN
            role ON employee.role_id = role.id
          LEFT JOIN
            department ON role.department_id = department.id
          WHERE
            department.name = ?
        `;

        connection.query(query, [answers.selectedDepartment], (error, results) => {
          if (error) {
            console.error('\x1b[31mError querying employees by department:\x1b[0m', error.message);
            return startApp(connection);
          }

          if (results.length === 0) {
            console.log(`\x1b[31mNo employees found for department ${answers.selectedDepartment}.\x1b[0m`);
          } else {
            const headers = ['Employee ID', 'First Name', 'Last Name', 'Job Title', 'Salary'];
            const colWidths = [15, 15, 15, 30, 10];

            displayTable(results, headers, colWidths, (row) => [
              row['Employee ID'],
              row['First Name'],
              row['Last Name'],
              row['Job Title'],
              row['Salary']
            ]);
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

function viewDepartmentBudget(connection, startApp) {
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
        message: 'Select a department to view the total budget:',
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

        const query = `
          SELECT
            SUM(role.salary) AS total_budget
          FROM
            employee
          INNER JOIN
            role ON employee.role_id = role.id
          INNER JOIN
            department ON role.department_id = department.id
          WHERE
            department.name = ?
        `;

        connection.query(query, [answers.selectedDepartment], (error, result) => {
          if (error) {
            console.error('\x1b[31mError querying total budget:\x1b[0m', error.message);
            return startApp(connection);
          }

          const totalBudget = result[0].total_budget || 0;
          console.log(`\x1b[32mTotal Utilized Budget for ${answers.selectedDepartment} department: $${Number(totalBudget).toFixed()}\x1b[0m`);

          return startApp(connection);
        });
      })
      .catch((error) => {
        console.error('\x1b[31mError in inquirer prompt:\x1b[0m', error.message);
        return startApp(connection);
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
  updateEmployeeRole,
  updateEmployeeManager,
  viewEmployeesByManager,
  viewEmployeesByDepartment,
  deleteDepartment,
  deleteRole,
  deleteEmployee,
  viewDepartmentBudget
}
