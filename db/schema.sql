CREATE DATABSE IF NOT EXISTS employee_tracker;
USE employee_tracker;

CREATE TABLE department {
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR (30) NOT NULL
};