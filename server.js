const mysql = require('mysql2');
const inquirer = require('inquirer');

const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // TODO: Add MySQL password
      password: 'Bingo$16141',
      database: 'tech_db'
     })

db.connect(err => {
  if (err) throw err;

  console.log(`Connected to the tech_db database.`);
  employeeTracker();
})

var employeeTracker = function () {
  //initail quetion
  inquirer.prompt([{
    type: 'list',
    name: 'prompt',
    message: 'What would you like to do?',
    choices: ['View ALL Department', 'View ALL Roles', 'View ALL Employees','Add A Department', 'Add A Role', 'Add An Employee', 'Update An Employee Role', 'Log Out']
  }]).then((answers) => {
    // handle view all departments
    if (answers.prompt === 'View ALL Department') {
      db.query('select * from department', (err, result) => {
        if (err) throw err;
        console.log('viewing ALL departments');
        console.table(result);
        employeeTracker();
      });
      // handle view all roles
    } else if (answers.prompt === 'View ALL Roles') {
      db.query('select * from role', (err, result) => {
        if (err) throw err;
        console.log("Viewing All Roles: ");
        console.table(result);
        employeeTracker(); 
      });
      // handle view all employees
    } else if (answers.prompt === 'View ALL Employees') {
      db.query('select * from employee', (err, result) => {
        if (err) throw err;
        console.log("Viewing All Employees: ");
        console.table(result);
        employeeTracker(); 
      });
      // haddle adding Department
    } else if (answers.prompt === 'Add A Department') {
      // prompt for name of new department
      inquirer.prompt([{
          type: 'input',
          name: 'department',
          message: 'What is the name of the dpeartment?',
          // confirm user input
          validate: departmentInput => {
              if (departmentInput) {
                  return true;
              } else {
                  console.log('Please Add A Department!');
                  return false;
              }
          }
      }]).then((answers) => {
          db.query(`INSERT INTO department (name) VALUES (?)`, [answers.department], (err, result) => {
              if (err) throw err;
              console.log(`Added ${answers.department} to the database.`)
              employeeTracker();
          });
      })
      // haddle adding role
    } else if (answers.prompt === 'Add A Role') {
      // Beginning with the database so that we may acquire the departments for the choice
      db.query(`SELECT * FROM department`, (err, result) => {
          if (err) throw err;

          inquirer.prompt([
              {
                  // Adding A Role
                  type: 'input',
                  name: 'role',
                  message: 'What is the name of the role?',
                  validate: roleInput => {
                      if (roleInput) {
                          return true;
                      } else {
                          console.log('Please Add A Role!');
                          return false;
                      }
                  }
              },
              {
                  // Adding the Salary
                  type: 'input',
                  name: 'salary',
                  message: 'What is the salary of the role?',
                  validate: salaryInput => {
                      if (salaryInput) {
                          return true;
                      } else {
                          console.log('Please Add A Salary!');
                          return false;
                      }
                  }
              },
              {
                  // Department
                  type: 'list',
                  name: 'department',
                  message: 'Which department does the role belong to?',
                  choices: () => {
                      var array = [];
                      for (var i = 0; i < result.length; i++) {
                          array.push(result[i].name);
                      }
                      return array;
                  }
              }
          ]).then((answers) => {
              // Comparing the result and storing it into the variable
              for (var i = 0; i < result.length; i++) {
                  if (result[i].name === answers.department) {
                      var department = result[i];
                  }
              }

              db.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [answers.role, answers.salary, department.id], (err, result) => {
                  if (err) throw err;
                  console.log(`Added ${answers.role} to the database.`)
                  employeeTracker();
              });
          })
      });
      // handle adding employee
  } else if (answers.prompt === 'Add An Employee') {
      // Calling the database to acquire the roles and managers
      db.query(`SELECT * FROM employee, role`, (err, result) => {
          if (err) throw err;

          inquirer.prompt([
              {
                  // Adding Employee First Name
                  type: 'input',
                  name: 'firstName',
                  message: 'What is the employees first name?',
                  validate: firstNameInput => {
                      if (firstNameInput) {
                          return true;
                      } else {
                          console.log('Please Add A First Name!');
                          return false;
                      }
                  }
              },
              {
                  // Adding Employee Last Name
                  type: 'input',
                  name: 'lastName',
                  message: 'What is the employees last name?',
                  validate: lastNameInput => {
                      if (lastNameInput) {
                          return true;
                      } else {
                          console.log('Please Add A Salary!');
                          return false;
                      }
                  }
              },
              {
                  // Adding Employee Role
                  type: 'list',
                  name: 'role',
                  message: 'What is the employees role?',
                  choices: () => {
                      var array = [];
                      for (var i = 0; i < result.length; i++) {
                          array.push(result[i].title);
                      }
                      var newArray = [...new Set(array)];
                      return newArray;
                  }
              },
              {
                  // Adding Employee Manager
                  type: 'input',
                  name: 'manager',
                  message: 'Who is the employees manager?',
                  validate: managerInput => {
                      if (managerInput) {
                          return true;
                      } else {
                          console.log('Please Add A Manager!');
                          return false;
                      }
                  }
              }
          ]).then((answers) => {
              // Comparing the result and storing it into the variable
              for (var i = 0; i < result.length; i++) {
                  if (result[i].title === answers.role) {
                      var role = result[i];
                  }
              }

              db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [answers.firstName, answers.lastName, role.id, answers.manager.id], (err, result) => {
                  if (err) throw err;
                  console.log(`Added ${answers.firstName} ${answers.lastName} to the database.`)
                  employeeTracker();
              });
          })
      });
      // handle updating employee
  } else if (answers.prompt === 'Update An Employee Role') {
      // Calling the database to acquire the roles and managers
      db.query(`SELECT * FROM employee, role`, (err, result) => {
          if (err) throw err;

          inquirer.prompt([
              {
                  // Choose an Employee to Update
                  type: 'list',
                  name: 'employee',
                  message: 'Which employees role do you want to update?',
                  choices: () => {
                      var array = [];
                      for (var i = 0; i < result.length; i++) {
                          array.push(result[i].last_name);
                      }
                      var employeeArray = [...new Set(array)];
                      return employeeArray;
                  }
              },
              {
                  // Updating the New Role
                  type: 'list',
                  name: 'role',
                  message: 'What is their new role?',
                  choices: () => {
                      var array = [];
                      for (var i = 0; i < result.length; i++) {
                          array.push(result[i].title);
                      }
                      var newArray = [...new Set(array)];
                      return newArray;
                  }
              }
          ]).then((answers) => {
              // Comparing the result and storing it into the variable
              for (var i = 0; i < result.length; i++) {
                  if (result[i].last_name === answers.employee) {
                      var name = result[i];
                  }
              }

              for (var i = 0; i < result.length; i++) {
                  if (result[i].title === answers.role) {
                      var role = result[i];
                  }
              }

              db.query(`UPDATE employee SET ? WHERE ?`, [{role_id: role}, {last_name: name}], (err, result) => {
                  if (err) throw err;
                  console.log(`Updated ${answers.employee} role to the database.`)
                  employeeTracker();
              });
          })
      });
      // handle log out
  } else if (answers.prompt === 'Log Out') {
      db.end();
      console.log('Bye')
    }
  })
}