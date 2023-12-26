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
            'View all roles',
            'Update employee manager',
            'View employees by manager',
            'View employees by department',
            'Delete a department',
            'View department budget',
            'Exit'
        ]
    })
    .then(answer => {
        switch (answer.action) {
            case 'View all employees':
                viewAllEmployees();
                break;
            case 'View all departments':
                viewAllDepartments();
                break;
            case 'View all roles':
                viewAllRoles();
                break;
            case 'Update employee manager':
                updateEmployeeManager();
                break;
            case 'View employees by manager':
                viewEmployeesByManager();
                break;
            case 'View employees by department':
                viewEmployeesByDepartment();
                break;
            case 'Delete a department':
                deleteDepartment();
                break;
            case 'View department budget':
                viewDepartmentBudget();
                break;
            case 'Exit':
                connection.end();
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

function updateEmployeeManager() {
    connection.query('SELECT id, first_name, last_name FROM employee', (err, employees) => {
        if (err) throw err;

        const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }));

        inquirer.prompt([
            {
                name: 'employeeId',
                type: 'list',
                message: 'Which employee\'s manager do you want to update?',
                choices: employeeChoices
            },
            {
                name: 'managerId',
                type: 'list',
                message: 'Who is the new manager?',
                choices: employeeChoices
            }
        ])
        .then(answers => {
            connection.query('UPDATE employee SET manager_id = ? WHERE id = ?', [answers.managerId, answers.employeeId], err => {
                if (err) throw err;
                console.log('Updated employee\'s manager.');
                startApp();
            });
        });
    });
}

function viewEmployeesByManager() {
    connection.query('SELECT id, first_name, last_name FROM employee WHERE manager_id IS NOT NULL', (err, managers) => {
        if (err) throw err;

        const managerChoices = managers.map(({ id, first_name, last_name }) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }));

        inquirer.prompt([
            {
                name: 'managerId',
                type: 'list',
                message: 'Select a manager to view their employees:',
                choices: managerChoices
            }
        ])
        .then(answer => {
            connection.query('SELECT first_name, last_name FROM employee WHERE manager_id = ?', answer.managerId, (err, res) => {
                if (err) throw err;
                console.table(res);
                startApp();
            });
        });
    });
}

function viewEmployeesByDepartment() {
    connection.query('SELECT id, name FROM department', (err, departments) => {
        if (err) throw err;

        const departmentChoices = departments.map(({ id, name }) => ({
            name: name,
            value: id
        }));

        inquirer.prompt([
            {
                name: 'departmentId',
                type: 'list',
                message: 'Select a department:',
                choices: departmentChoices
            }
        ])
        .then(answer => {
            connection.query(
                'SELECT employee.first_name, employee.last_name FROM employee JOIN role ON employee.role_id = role.id WHERE role.department_id = ?', 
                answer.departmentId, 
                (err, res) => {
                    if (err) throw err;
                    console.table(res);
                    startApp();
                }
            );
        });
    });
}

function deleteDepartment() {
    connection.query('SELECT id, name FROM department', (err, departments) => {
        if (err) throw err;

        const departmentChoices = departments.map(({ id, name }) => ({
            name: name,
            value: id
        }));

        inquirer.prompt([
            {
                name: 'departmentId',
                type: 'list',
                message: 'Select a department to delete:',
                choices: departmentChoices
            }
        ])
        .then(answer => {
            connection.query('DELETE FROM department WHERE id = ?', answer.departmentId, err => {
                if (err) throw err;
                console.log('Department deleted.');
                startApp();
            });
        });
    });
}

function viewDepartmentBudget() {
    connection.query('SELECT id, name FROM department', (err, departments) => {
        if (err) throw err;

        const departmentChoices = departments.map(({ id, name }) => ({
            name: name,
            value: id
        }));

        inquirer.prompt([
            {
                name: 'departmentId',
                type: 'list',
                message: 'Select a department to view its utilized budget:',
                choices: departmentChoices
            }
        ])
        .then(answer => {
            connection.query(
                'SELECT SUM(salary) AS utilized_budget FROM role JOIN employee ON role.id = employee.role_id WHERE department_id = ?', 
                answer.departmentId, 
                (err, res) => {
                    if (err) throw err;
                    console.log(`Total Utilized Budget: ${res[0].utilized_budget}`);
                    startApp();
                }
            );
        });
    });
}
