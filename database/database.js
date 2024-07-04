const mysql = require('mysql');
require('dotenv').config();

const database = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD
});

database.connect(err => {
    if (err) {
        console.error("Connection Error:", err);
        throw err;
    }
    console.log('Connected to MySQL server');

    const dbName = process.env.DATABASE;
    database.query(`SHOW DATABASES LIKE '${dbName}'`, (err, result) => {
        if (err) {
            console.error("Query Error:", err);
            throw err;
        }
        if (result.length > 0) {
            console.log("Database already exists. Connecting to it.");
            connectToDatabase(dbName);
        } else {
            console.log("Database does not exist. Creating it.");
            createDatabase(dbName);
        }
    });
});

function createDatabase(dbName) {
    database.query(`CREATE DATABASE ${dbName}`, err => {
        if (err) {
            console.error("Database Creation Error:", err);
            throw err;
        }
        console.log("Database Created");
        connectToDatabase(dbName);
    });
}

function connectToDatabase(dbName) {
    database.changeUser({ database: dbName }, err => {
        if (err) {
            console.error("User Change Error:", err);
            throw err;
        }
        console.log(`Connected to database: ${dbName}`);
        createTables();
    });
}

function createTables() {
    const queries = [
        `CREATE TABLE IF NOT EXISTS books (
            BookId INT AUTO_INCREMENT PRIMARY KEY,
            BookName VARCHAR(255),
            AuthorName VARCHAR(255),
            PublicationName VARCHAR(255),
            Pages INT,
            HardCover BOOLEAN
        )`,
        `CREATE TABLE IF NOT EXISTS students (
            Id INT AUTO_INCREMENT PRIMARY KEY,
            StudentName VARCHAR(255),
            BookId INT,
            DateBooked DATE,
            DateSubmitted DATE,
            Available BOOLEAN,
            DateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            DateUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (BookId) REFERENCES books(BookId)
        )`
    ];

    queries.forEach(query => {
        database.query(query, err => {
            if (err) {
                console.error("Table Creation Error:", err);
                throw err;
            }
        });
        console.log("Table create successfully");
    });
}

module.exports = database;
