const inquirer = require ('inquirer');
const mysql = require ('mysql12');

const myConnection = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: 'password',
    datbase: 'employee_tracker'
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
            // Add other choices here
        ]
    })
    .then(answer => {
        switch (answer.action) {
            case 'View all employees':
                viewAllEmployees();
                break;
            // Add other cases here
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
