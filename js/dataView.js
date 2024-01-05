// Import the inquirer library for handling command-line prompts
const inquirer = require('inquirer');

// Import utility function for displaying tables
const { displayTable } = require('./utils');

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

// Function to retrieve and display employees managed by a selected manager from the database
function viewEmployeesByManager(connection, startApp) {
  // SQL query to select distinct managers from the employee table
  const managersQuery = `
    SELECT 
      DISTINCT CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
    FROM 
      employee 
    LEFT JOIN
      employee AS manager ON employee.manager_id = manager.id 
    WHERE 
      manager.id IS NOT NULL`;

  // Execute the SQL query to retrieve distinct manager data
  connection.query(managersQuery, (error, results) => {
    // Check for errors during the database query
    if (error) {
      // Log an error message in red if there is an error retrieving manager data
      console.error('\x1b[31mError retrieving manager data:\x1b[0m', error);
      // Call the startApp function to return to the main menu
      return startApp(connection);
    }

    // Check if there are no managers available
    if (results.length === 0) {
      // Log a message in red indicating that no managers are available
      console.log('\x1b[31mNo managers available. Please add a manager first.\x1b[0m');
      // Call the startApp function to return to the main menu
      return startApp(connection);
    }

    // Use the inquirer library to prompt the user to select a manager
    inquirer
      .prompt({
        type: 'list',
        name: 'selectedManager',
        message: 'Select a manager:',
        // Provide a list of manager choices for the user
        choices: managerChoices = results.map((manager) => manager.manager),
      })
      // Handle the user's input using a promise
      .then((answers) => {
        // SQL query to retrieve employee data for the selected manager
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

        // Execute the SQL query to retrieve employee data for the selected manager
        connection.query(query, [answers.selectedManager], (error, results) => {
          // Check for errors during the database query
          if (error) {
            // Log an error message in red if there is an error retrieving employee data
            console.error('\x1b[31mError retrieving manager data:\x1b[0m', error);
            // Call the startApp function to return to the main menu
            return startApp(connection);
          }

          // Check if no employees are found for the selected manager
          if (results.length === 0) {
            // Log a message in red indicating that no employees are found for the selected manager
            console.log(`\x1b[31mNo employees found for manager ${answers.selectedManager}.\x1b[0m`);
          } else {
            // Define table headers and column widths for displaying the results
            const headers = ['Employee ID', 'First Name', 'Last Name', 'Job Title', 'Department Name', 'Salary'];
            const colWidths = [15, 15, 15, 30, 25, 15];

            // Display the results in a formatted table
            displayTable(results, headers, colWidths, (row) => [
              row['Employee ID'],
              row['First Name'],
              row['Last Name'],
              row['Job Title'],
              row['Department Name'],
              row['Salary']
            ]);
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

// Function to retrieve and display employees by department from the database
function viewEmployeesByDepartment(connection, startApp) {
  // SQL query to select all departments from the department table
  const departmentsQuery = 'SELECT * FROM department';

  // Execute the SQL query to retrieve department data
  connection.query(departmentsQuery, (error, departmentResults) => {
    // Check for errors during the database query
    if (error) {
      // Log an error message in red if there is an error querying departments
      console.error('\x1b[31mError querying departments:\x1b[0m', error.message);
      // Call the startApp function to return to the main menu
      return startApp(connection);
    }

    // Check if there are no departments found
    if (departmentResults.length === 0) {
      // Log a message in red indicating that no departments are found
      console.log('\x1b[31mNo departments found.\x1b[0m');
      // Call the startApp function to return to the main menu
      return startApp(connection);
    }

    // Use the inquirer library to prompt the user to select a department
    inquirer
      .prompt({
        type: 'list',
        name: 'selectedDepartment',
        message: 'Select a department to view employees:',
        // Provide a list of department choices for the user
        choices: departmentResults.map(department => department.name),
      })
      // Handle the user's input using a promise
      .then((answers) => {
        // SQL query to retrieve employee data for the selected department
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

        // Execute the SQL query to retrieve employee data for the selected department
        connection.query(query, [answers.selectedDepartment], (error, results) => {
          // Check for errors during the database query
          if (error) {
            // Log an error message in red if there is an error querying employees by department
            console.error('\x1b[31mError querying employees by department:\x1b[0m', error.message);
            // Call the startApp function to return to the main menu
            return startApp(connection);
          }

          // Check if no employees are found for the selected department
          if (results.length === 0) {
            // Log a message in red indicating that no employees are found for the selected department
            console.log(`\x1b[31mNo employees found for department ${answers.selectedDepartment}.\x1b[0m`);
          } else {
            // Define table headers and column widths for displaying the results
            const headers = ['Employee ID', 'First Name', 'Last Name', 'Job Title', 'Salary'];
            const colWidths = [15, 15, 15, 30, 10];

            // Display the results in a formatted table
            displayTable(results, headers, colWidths, (row) => [
              row['Employee ID'],
              row['First Name'],
              row['Last Name'],
              row['Job Title'],
              row['Salary']
            ]);
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

// Function to retrieve and display the total utilized budget of a selected department from the database
function viewDepartmentBudget(connection, startApp) {
  // SQL query to select all departments from the department table
  const departmentsQuery = 'SELECT * FROM department';

  // Execute the SQL query to retrieve department data
  connection.query(departmentsQuery, (error, departmentResults) => {
    // Check for errors during the database query
    if (error) {
      // Log an error message in red if there is an error querying departments
      console.error('\x1b[31mError querying departments:\x1b[0m', error.message);
      // Call the startApp function to return to the main menu
      return startApp(connection);
    }

    // Check if there are no departments found
    if (departmentResults.length === 0) {
      // Log a message in red indicating that no departments are found
      console.log('\x1b[31mNo departments found.\x1b[0m');
      // Call the startApp function to return to the main menu
      return startApp(connection);
    }

    // Use the inquirer library to prompt the user to select a department
    inquirer
      .prompt({
        type: 'list',
        name: 'selectedDepartment',
        message: 'Select a department to view the total budget:',
        // Provide a list of department choices for the user
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

        // SQL query to retrieve the total utilized budget for the selected department
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

        // Execute the SQL query to retrieve the total utilized budget
        connection.query(query, [answers.selectedDepartment], (error, result) => {
          // Check for errors during the database query
          if (error) {
            // Log an error message in red if there is an error querying the total budget
            console.error('\x1b[31mError querying total budget:\x1b[0m', error.message);
            // Call the startApp function to return to the main menu
            return startApp(connection);
          }

          // Extract the total budget value from the query result
          const totalBudget = result[0].total_budget || 0;
          
          // Log the total utilized budget for the selected department in green
          console.log(`\x1b[32mTotal Utilized Budget for ${answers.selectedDepartment} department: $${Number(totalBudget).toFixed()}\x1b[0m`);

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
  viewAllDepartments,
  viewAllRoles,
  viewAllEmployees,
  viewEmployeesByManager,
  viewEmployeesByDepartment,
  viewDepartmentBudget
}
