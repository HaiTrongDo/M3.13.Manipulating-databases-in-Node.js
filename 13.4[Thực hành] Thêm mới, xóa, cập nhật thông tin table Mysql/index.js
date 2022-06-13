const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Password',
    database: 'dbTest',
    charset: 'utf8_general_ci'
});

connection.connect(function (err) {
    if (err) {
        throw err.stack;
    }
    else {
        console.log("connect success");
    }
});

const sqlCreate = "CREATE TABLE IF NOT EXISTS products (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), price INT)";
connection.query(sqlCreate, function (err, result) {
    if (err) throw err;
    console.log("Create table success");
});

const sqlDrop = "DROP TABLE IF EXISTS products";
connection.query(sqlDrop, function (err, result) {
    if (err) throw err;
    console.log("Drop table success");
});

const sqlAlter = "ALTER TABLE customer ADD COLUMN age INT DEFAULT 30";
connection.query(sqlAlter, function (err, result) {
    if (err) throw err;
    console.log("Alter table success");
});