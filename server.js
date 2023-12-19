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
    choices: ['View ALL Department', 'View ALL Roles', 'View ALL Employees','Add A Department', 'Log Out']
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
      // handle log out
    } else if (answers.prompt === 'Log Out') {
      db.end();
      console.log('Bye')
    }
  })
}