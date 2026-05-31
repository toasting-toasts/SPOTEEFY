const mysql2 = require("mysql2");
require("dotenv").config();

const pool = mysql2.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "root",
    port: process.env.DB_PORT || 3306,
    database: process.env.DATABASE || "world",
    waitForConnections: true,
    connectionLimit: 30,
    queueLimit: 50
}).promise();

module.exports = pool;