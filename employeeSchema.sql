DROP DATABASE IF EXISTS employee_db;

CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE employees (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NULL,
  last_name VARCHAR(30) NULL,
  role_id INT NULL,
  manager_id INT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY(role_id) REFERENCES roles(roleID),
  FOREIGN KEY(manager_id) REFERENCES roles(roleID)
);

CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT, 
    title VARCHAR(30),
    salary DECIMAL(10, 4)
    department_id INT NULL,
    FOREIGN KEY(department_id) REFERENCES department(departmentID)
);

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT, 

    FOREIGN KEY(department_id) REFERENCES department(departmentID)
);

SELECT * FROM employees;
SELECT * FROM roles;
SELECT * FROM department;
