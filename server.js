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
    inquirer.prompt([{
      type: 'list',
      name: 'prompt',
      message: 'What would you like to do?',
      choices: ['View ALL Department', 'View ALL Roles', 'View ALL Employees']
    }]).then((answers) => {
      // handle department view
      if (answers.prompt === 'View ALL Department') {
        db.query('select * from department', (err, result) => {
          if (err) throw err;
          console.log('viewing ALL departments');
          console.table(result);
          employeeTracker();
        });
        // handle role view
      } else if (answers.prompt === 'View ALL Roles') {
        db.query('select * from role', (err, result) => {
          if (err) throw err;
          console.log("Viewing All Roles: ");
          console.table(result);
          employeeTracker(); 
        });
        // handle employee view
      } else if (answers.prompt === 'View ALL Employees') {
        db.query('select * from employee', (err, result) => {
          if (err) throw err;
          console.log("Viewing All Employees: ");
          console.table(result);
          employeeTracker(); 
        });
      }
    })
  }