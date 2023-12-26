INSERT INTO department (name) VALUES 
('Sales'), 
('Engineering'),
('Finance'), 
('Legal');

INSERT INTO role (title, salary, department_id) VALUES 
('Sales Lead', 100000, 1), 
('Software Engineer', 120000, 2),
('Financial Analyst', 90000, 3),
('Legal Advisor', 110000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES 
('Tyler', 'Yannes', 1, NULL),
('Jane', 'Doe', 2, 1),
('John', 'Smith', 3, 1),
('Alice', 'Johnson', 4, 2),
('Bob', 'Brown', 1, 2),
('Emma', 'Davis', 3, 2);
