const mysql = require('mysql');
const http = require('http');

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
        const sql = "CREATE TABLE IF NOT EXISTS products (id INT NOT NULL PRIMARY KEY AUTO_INCREMENT ,name varchar(30) not null, price INT NOT NULL)";
        connection.query(sql, function (err) {
            if (err) {
                console.log(err);
            }
            console.log('Create table success');
        });
    }
});

const server = http.createServer(async (req, res) => {
    try {
        if (req.url === "/product/create" && req.method === 'POST') {
            const buffers = [];
            for await (const chunk of req) {
                buffers.push(chunk);
            }
            const data = Buffer.concat(buffers).toString();
            const product = JSON.parse(data);
            const price = parseInt(product.price);
            const sqlCreate = `INSERT INTO products(name, price) VALUES ('${product.name}', '${price}');`;
            connection.query(sqlCreate, (err, results, fields) => {
                if (err) throw err;
                res.end(JSON.stringify(product))
            });
        }

    } catch (err) {
        return res.end(err.message);
    }
});

server.listen(8080, function () {
    console.log('server running at localhost:8080 ')
});