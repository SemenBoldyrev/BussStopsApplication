const express = require('express');
const mysql = require('mysql');

const con = mysql.createConnection({
    host: "d26893.mysql.zonevs.eu",
    user: "d26893_busstops",
    password: "3w7PYquFJhver0!KdOfF",
    database: "d26893_busstops"
});

console.log("Connecting to database...");
con.connect(function(err) {
  if (err) {
    console.error("Error connecting to database:", err);
    throw err;
  }
  console.log("Connected to database!");
});