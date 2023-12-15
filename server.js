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
    },
    console.log(`Connected to the tech_db database.`)
  );