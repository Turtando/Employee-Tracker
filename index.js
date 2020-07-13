//Dependencies
var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("console.table");
require("dotenv").config();

// Objects/array for answers to be pushed into
const employees = [];
const roles = [];
const department = [];

var connection = mysql.createConnection({
  host: "localhost",
  // Your port; if not 3000
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "christopherturton",
  database: "employee_db",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  runSearch();
});

function runSearch() {
  inquirer
    .prompt([
      {
        name: "action",
        type: "list",
        message: "What would you like do",
        choices: [
          "View All Employees",
          "View All Departments",
          "View All Roles",
          "Add Employee",
          "Add Department",
          "Add Role",
          "Update Employee Manager",
        ],
      },
    ])
    .then(function (answer) {
      switch (answer.action) {
        case "View All Employees":
          viewEmployees();
          break;
        case "View All Departments":
          viewDepartments();
          break;
        case "View All Roles":
          viewRoles();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Add Department":
          addDepartment();
          break;
        case "Add Role":
          addRole();
          break;
        case "Update Employee":
          updateEmployee();
          break;
      }
    });
}

function viewEmployees() {
  connection.query(
    "SELECT employees.id, employees.first_name, employees.last_name, employees.role_id, employees.manager_id  FROM employees",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      runSearch();
    }
  );
}

function viewDepartments() {
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    console.table(res);
    runSearch();
  });
}

function viewRoles() {
  connection.query("SELECT * FROM roles", function (err, res) {
    if (err) throw err;
    console.table(res);
    runSearch();
  });
}

function addEmployee() {
  inquirer
    .prompt([
      {
        message: "What is the first name of the employee",
        name: "first_name",
        type: "input",
      },
      {
        message: "What is the last name of the employee",
        name: "last_name",
        type: "input",
      },
    ])
    .then(function (res) {
      let newEmployee = [res.first_name,  res.last_name];
      connection.query("SELECT * FROM roles", function (err, res) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
          roles.push(res[i].title);
        }
        inquirer
          .prompt([
            {
              type: "list",
              message: "What is this employee's role?",
              name: "employeeRole",
              choices: roles,
            },
          ])
          .then(function (res) {
            connection.query(
              "SELECT id FROM roles WHERE title = ?", [
                res.employeeRole
              ],
              function (err, res) {
                if (err) throw err;

                var roleID = res[0].id;
                connection.query(
                  "SELECT * FROM employees",
                  function (err, res) {
                    if (err) throw err;
                    for (let i = 0; i < res.length; i++) {
                      let newName = `${res[i].first_name} ${res[i].last_name}`;
                      employees.push(newName);
                    }
                    inquirer
                      .prompt([
                        {
                          type: "list",
                          message: "Who is their manager?",
                          name: "employeeManager",
                          choices: employees,
                        },
                      ])
                      .then(function (answer) {
                        let employee = answer.employeeManager.split(" ")
                        connection.query(
                          "SELECT id FROM employees WHERE first_name = ? AND last_name = ?",
                          [employee[0], employee[1]],
                          function (err, res) {
                            if (err) throw err;
                            connection.query(
                              "INSERT INTO employees SET ?",
                              {
                                first_name: newEmployee[0],
                                last_name: newEmployee[1],
                                role_id: roleID,
                                manager_id: res[0].id,
                              },
                              function (err, res) {
                                if (err) throw err;
                                console.log(
                                  res.affectedRows + " employee created!"
                                );
                                runSearch();
                              }
                            );
                          }
                        );
                      });
                  }
                );
              }
            );
          });
      });
    });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the name of the department",
        name: "department"
      },
    ])
    .then(function (answer) {
      console.log("Adding department...");
            connection.query("INSERT INTO department SET ?",
              { name : answer.department },
              function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " department created!");
                runSearch();
              });
            });
}
function addRole() {
  let department = [];
  connection.query(
    "SELECT name FROM department",
    function (err, res) {
      if (err) throw err;
      for (let i = 0; i < res.length; i++) {
        let newDepartment = res[i].name;
        department.push(newDepartment);
      }
    })
    inquirer
      .prompt([
        {
          message: "What is the role you you'd like to add?",
          name: "role",
          type: "input",
        },
        {
          type: "input",
          message: "Salary?",
          name: "salary",
        },
        {
          type: "list",
          message: "What department ?",
          name: "department",
          choices: department,
        },
      ])
      .then(function(answer) {
        connection.query(
          "SELECT id FROM department WHERE name = ?",
          [answer.department],
          function (err, res) {
            if (err) throw err;
            connection.query(
              "INSERT INTO roles SET ?",
              {
                title: answer.role,
                salary: answer.salary,
                department_id: res[0].id,
              },
              function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " role created!");
                runSearch();
              }
            );
          }
        );
      });
  
}


// function managerSearch() {
//   inquirer
//   .prompt([
//     {
//     type: "list",
//     name: "manager",
//     message: "What manager are you looking for?",
//     type: "input",
//     }
//   ]).then(function(answer) {
//     console.log(answer.department)
//     connection.query("SELECT * FROM employee_db WHERE ?" , {manager: answer.manager_id}, function(err, res) {
//       if (err) throw err;
//       console.log("Manager: " + res.manager_id);
//       runSearch();
//     })
//   })
// }

// function removeEmployee() {
//   inquirer
//     .prompt([
//       {
//       type: "list",
//       message: "What employee would you like to remove?",
//       type: "input",
//       name: "employee"
//       }
//     ]).then(function({  }) {

//     })
