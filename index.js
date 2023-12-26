const inquirer = require ('inquirer');
const mysql = require('mysql2');

const connection = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employee_tracker'
});

connection.connect (err => {
    if (err) throw err;
    console.log('Connected as id ' + connection.threadId);
    startApp();

});

function startApp() {
    inquirer.prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'View all employees',
            'View all departments',
        ]
    })
    .then(answer => {
        switch (answer.action) {
            case 'View all employees':
                viewAllEmployees();
                break;
        }
    });
}

function viewAllEmployees() {
    connection.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        console.log(res);
        startApp();
    });
}

function viewAllDepartments() {
    connection.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        console.log(res);
        startApp();
    });
}

function viewAllRoles() {
    connection.query('SELECT * FROM role', (err, res) => {
        if (err) throw err;
        console.log(res);
        startApp();
    });
}