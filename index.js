var mysql = require("mysql");
var express = require("express");
var inquirer = require("inquirer");


var connection = mysql.createConnection({
  host: "localhost",
  // Your port; if not 3000
  port: 3000,

  // Your username
  user: "root",

  // Your password
  password: "christopherturton",
  database: "employee_db"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n")
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
          "View All Employees By Department",
          "View All Employees By Roles",
          "Add Employee",
          "Add Department",
          "Add Role",
          "Update Employee Manager"
        ]
      }
    ]).then(function(answer){
      switch (answer.action) {
        case "View All Employees":
          viewEmployees();
          break;
        case "View All Employees By Department":
          viewDepartments();
          break;
        case "View All Employees By Role":
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
    })
}

function viewEmployees() {
    console.log("Searching for all employees...\n");
    connection.query(
      "SELECT * FROM employee_db", function(err, res) {
        if (err) throw err;
        console.log(res);
        runSearch();
      }
  )
}

function viewDepartments() {
  inquirer 
  .prompt([
    {
    name: "department",
    message: "What department of employees are you looking for?",
    type: "input", 
    } 
  ]).then(function(answer) {
    console.log(answer.department)
    connection.query("SELECT * FROM employee_db WHERE ?" , {department: answer.department_name}, function(err, res) {
      if (err) throw err;
      console.log("Department: " + res.department); 
      runSearch(); 
    })
  })
}

function viewRoles() {
  inquirer 
  .prompt([
    {
    name: "role",
    message: "What role of employees are you looking for?",
    type: "input", 
    } 
  ]).then(function(answer) {
    console.log(answer.department)
    connection.query("SELECT * FROM employee_db WHERE ?" , {role: answer.roles}, function(err, res) {
      if (err) throw err;
      console.log("Department: " + res.roles); 
      runSearch(); 
    })
  })
}

function addEmployee() {
  inquirer 
    .prompt([
      {
      type: "list",
      message: "What is the first name of the employee",
      name: "first_name",
      type: "input", 
      },
      {
        type: "list",
        message: "What is the last name of the employee",
        name: "last_name",
        type: "input", 
      }  
    ]).then(function(answer) {
      console.log("Adding employee...")
      connection.query("INSERT INTO employee_db ?" [answer.first_name, answer.last_name], function(err,res){
        if (err) throw err;
      } )
    })
}

function addDepartment() {
  inquirer 
    .prompt([
      {
      type: "list",
      message: "What is the first name of the employee",
      name: "first_name",
      type: "input", 
      },
      {
        type: "list",
        message: "What is the last name of the employee",
        name: "last_name",
        type: "input", 
      }  
    ]).then(function(answer) {
      console.log("Adding department...")
      connection.query("INSERT INTO employee_db ?" [res.department], function(err,res){
        if (err) throw err;
      } )
    })
}
function addRole() {
  inquirer 
    .prompt([
      {
      type: "list",
      message: "What is the role of employees you'd like to search",
      name: "role",
      type: "input", 
      },
    ]).then(function(answer) {
      connection.query("INSERT INTO employee_db ?" [answer.role], function(err,res){
        if (err) throw err;
      } )
    })
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
 