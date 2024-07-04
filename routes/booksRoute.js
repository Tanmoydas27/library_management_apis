const express = require('express');
const booksRouter = express.Router();
const database = require('../database/database.js')

booksRouter.post('/createbook', (req, res) => {
    try {
        const { BookName, AuthorName, PublicationName, Pages, HardCover } = req.body;
        const query = `
            INSERT INTO books (BookName, AuthorName, PublicationName, Pages, HardCover) 
            VALUES (?, ?, ?, ?, ?)`;

        const hardCoverValue = HardCover === 'true' ? 1 : 0;

        database.query(query, [BookName, AuthorName, PublicationName, Pages, hardCoverValue], (err, result) => {
            if (err) {
                console.log(err);
                res.status(403).json({ message: "Book creation failed" });
            } else {
                res.status(200).json({ message: "Book created successfully" });
            }
        });
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


booksRouter.get('/getallbooks', (req,res) => {
    try {
        
        const query = `select * from books`;
        database.query(query, (err, result) => {
           if(err){
               res.status(403).json({message: "Books Failed to load"});
           } else {
            res.status(200).json({data:result, message: "Books   fetched  successfully"});
           }
       });
    } catch (error) {
        console.log("error",error);
        res.status(500).json({message:"Internal server error"});
    }
   
});

booksRouter.delete('/deletebook/:id', (req, res) => {
    try {
        const query = "DELETE FROM books WHERE BookId = ?";
        const bookId = req.params.id;
        database.query(query, [bookId], (err, result) => {
            if (err) {
                console.log(err);
                res.json({ message: "Book not deleted" });
            } else {
                res.status(200).json({ message: "Book deleted successfully" });
            }
        });
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = booksRouter;
