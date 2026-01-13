const DatabaseNames = require('./DatabaseNames.js');
const mysql = require('mysql');
const express = require('express');

const con = mysql.createConnection({
    host: "d26893.mysql.zonevs.eu",
    user: "d26893_busstops",
    password: "3w7PYquFJhver0!KdOfF",
    database: "d26893_busstops"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connecting to database...");

});

const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.append("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.append("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.append("Access-Control-Allow-Credentials", "true");
    res.append("Content-Type", "application/json");
    next();
});

app.listen(8000, () => {
    console.log("Server running at http://localhost:8000/");
});

//

app.get('/', (req, res) => {
    res.send('Sample page');
});

app.get('/stops', (req, res) => {
    const query = `SELECT * FROM ${DatabaseNames.STOPS} LIMIT 100`;
    SendRequest(query, res);
});
//

function SendRequest(sql, res) 
{
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.json(result);
    });
} 

