const mysql = require('mysql');
const fs = require('fs')
const qs = require('qs')
const http = require('http')


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Password',
    database: 'exercise_DB',
    charset: 'utf8_general_ci'
})

connection.connect(err => {
    if (err) {
        throw err.stack
    } else {
        console.log("connect success")
        const sql = "CREATE TABLE IF NOT EXISTS products (id INT PRIMARY KEY AUTO_INCREMENT,  productName VARCHAR(30), productPrice INT)"
        connection.query(sql, err => {
            if (err) {
                console.log(err.message)
            }
            console.log('Create table success');
        })
    }
})

function loadWebsite(res) {
    fs.readFile("./index.html", "utf-8", (err, data) => {
        let selectData = `SELECT * FROM products;`
        let html = ''
        connection.query(selectData, (err, results, fields) => {
            if (err) {
                console.log(err.message)
                return;
            }
            results.forEach(element => {
                html += `<tr>
                                <td>${element.id}</td>
                                <td>${element.productName}</td>
                                <td>${element.productPrice}</td>
                                </tr>`
            })
            data = data.replace('{data}', html)
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data)
            res.end();
        })
    })
}

function insertData(req, res) {
    let inputData = ''
    req.on('data', chunk => {
        inputData += chunk
    })
    req.on('end', () => {
        let newProduct = qs.parse(inputData)
        console.log(newProduct);
        let sqlInsert = `INSERT INTO products(productName,productPrice) VALUES ('${newProduct.productName}',${Number(newProduct.productPrice)});`;
        connection.query(sqlInsert, (err, results, fields) => {
            if (err) {
                console.log(err.message)
            }
            console.log(`new product ${newProduct.productName} has been added to table Products at $${newProduct.productPrice})`)
            loadWebsite(res)
        })
    })
    req.on("error", err => {
        console.log(err.message)
    })
}

const server = http.createServer((req, res) => {
    if (req.method === "GET") {
        loadWebsite(res);
    }
    else
        {
            insertData(req, res);
        }
    }
).
    listen(5000, () => {
        console.log("server is listening on port 5000")
    })


