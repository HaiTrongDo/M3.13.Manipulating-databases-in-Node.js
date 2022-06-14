const mysql = require('mysql');
const fs = require('fs')
const qs = require('qs')
const http = require('http')
const url = require('url')

const editButton = (obj) => {
    return `<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@getbootstrap" onclick='getData(${obj})'>Edit</button>`
}


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

 function querySQL(sql) {
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, results, fields) => {
            if (err) {
                reject(err)
            }
            resolve(results)
        })
    })
}

function loadWebsite(res) {
    fs.readFile("./index.html", "utf-8", (err, data) => {
        let sql = `SELECT * FROM products;`
        let html = ''

        querySQL(sql).then(results => {
            results.forEach(element => {
                html += `<tr>
                                <td>${element.id}</td>
                                <td>${element.productName}</td>
                                <td>${element.productPrice}</td>
                                <td>${editButton(JSON.stringify(element))}</td>
                                </tr>`
            })
            data = data.replace('{data}', html)
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data)
            res.end();
        }).catch(err => {
            console.log(err.message)
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
        if (newProduct.id === undefined) {
            let sqlInsert = `INSERT INTO products(productName,productPrice) VALUES ('${newProduct.productName}',${Number(newProduct.productPrice)});`;
            connection.query(sqlInsert, (err, results, fields) => {
                if (err) {
                    console.log(err.message)
                }
                console.log(`new product ${newProduct.productName} has been added to table Products at $${newProduct.productPrice})`)
                loadWebsite(res)
            })
        } else if (newProduct.id){
            let sqlInsert = `UPDATE products SET productName ='${newProduct.productName}', productPrice= ${Number(newProduct.productPrice)} WHERE id=${Number(newProduct.id)};`;
            connection.query(sqlInsert, (err, results, fields) => {
                if (err) {
                    console.log(err.message)
                }
                console.log(`product ID ${newProduct.id} has been updated with Product Name: ${newProduct.productName} with price: $${newProduct.productPrice})`)
                loadWebsite(res)
            })
        }
    })
    req.on("error", err => {
        console.log(err.message)
    })
}


const server = http.createServer((req, res) => {

        if (req.method === "GET" && req.url === '/') {
            loadWebsite(res);
        } else if (req.method === "POST" && req.url === '/') {
            insertData(req, res);
        } else if (req.method === "GET" && req.url === '/edit') {
            console.log(1)
            res.end()
        }
    }
).listen(5000, () => {
    console.log("server is listening on port 5000")
})


