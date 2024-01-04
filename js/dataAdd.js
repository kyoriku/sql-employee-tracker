// Import the inquirer library for handling command-line prompts
const inquirer = require('inquirer');

// Import utility function for input validation
const { validateInput, validateSalary } = require('./utils');

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
        // Values to be inserted into the query (role title, salary, and department id)
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

// Export the functions for use in the 'app.js' file
module.exports = {
  addDepartment,
  addRole,
  addEmployee
}