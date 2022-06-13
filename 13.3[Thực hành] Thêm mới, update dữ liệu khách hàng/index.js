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
const sqlInsert = "INSERT INTO customer (name, address) VALUES ('Do Tien Thanh', 'Phu Tho')";
connection.query(sqlInsert, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
});

const sqlUpdate = "UPDATE customer SET address = 'Hai Duong' WHERE name = 'hung'";
connection.query(sqlUpdate, function (err, result) {
    if (err) throw err;
    console.log(result.affectedRows + " record(s) updated");
});
