const mysql = require('mysql2');

// DB connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'arjun123456789',
    database: 'cms'
}
    , console.log("Connection Established to the DB!!!")
);

module.exports = db;