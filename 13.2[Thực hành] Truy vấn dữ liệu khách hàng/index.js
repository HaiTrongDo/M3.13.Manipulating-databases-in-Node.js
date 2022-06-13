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

const sqlSelect = 'SELECT * FROM customer';
connection.query(sqlSelect, (err, results, fields) => {
    if (err) throw err;
    console.log(results)
});

const sqlWhere = "SELECT * FROM customer WHERE address = 'Thai Binh'";
connection.query(sqlWhere, (err, results, fields) => {
    if (err) throw err;
    console.log(results, "where");
});

const sqlLimit = "SELECT * FROM customer LIMIT 3";
connection.query(sqlLimit, (err, results, fields) => {
    if (err) throw err;
    console.log(results, "limit");
});