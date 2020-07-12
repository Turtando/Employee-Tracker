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
    runSearch();
  });