const express = require('express');
const studentsRouter = express.Router();
const database = require('../database/database.js');

studentsRouter.post('/rentbook', (req,res) => {
    try {
        const {StudentName,BookId,DateBooked,DateSubmitted,Available} = req. body;
        const query = `
            INSERT INTO students (StudentName,BookId,DateBooked,DateSubmitted,Available)
            VALUES (?, ?, ?, ?, ?)`;

            const availableValue = Available === 'true' ? 1 : 0 ;
        database.query(query,[StudentName, BookId, DateBooked, DateSubmitted, availableValue], (err,result) => {
            if(err){
                console.log(err);
                res.status(403).json({ message: "Student Book issue failed" });
            } else {
                res.status(200).json({ message: "Student Book issued successfully" });
            }
        })
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

studentsRouter.get('/getrentalbooks', (req, res) => {
    try {
        const query = `
            SELECT 
            students.Id, students.StudentName,books.BookId, books.BookName,books.AuthorName,
            students.DateBooked, students.DateSubmitted, students.Available 
            FROM students INNER JOIN books ON students.BookId = books.BookId`;

        database.query(query, (err, result) => {
            if (err) {
                console.log(err);
                res.status(403).json({ message: "Failed to load students" });
            } else {
                res.status(200).json({ data: result, message: "Students fetched successfully" });
            }
        });
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

studentsRouter.put('/updaterentbook/:id', (req, res) => {
    try {
        const { StudentName, BookId, DateBooked, DateSubmitted, Available } = req.body;
        const studentId = req.params.id;
        const query = `
            UPDATE students SET 
            StudentName = ?, BookId = ?, DateBooked = ?, DateSubmitted = ?, Available = ?, DateUpdated = CURRENT_TIMESTAMP 
            WHERE Id = ?`;

        const availableValue = Available === 'true' ? 1 : 0;

        database.query(query, [StudentName, BookId, DateBooked, DateSubmitted, availableValue, studentId], (err, result) => {
            if (err) {
                console.log(err);
                res.status(403).json({ message: "Student update failed" });
            } else {
                res.status(200).json({ message: "Student updated successfully" });
            }
        });
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

studentsRouter.delete('/deletestudent/:id', (req, res) => {
    try {
        const query = "DELETE FROM students WHERE Id = ?";
        const studentId = req.params.id;
        database.query(query, [studentId], (err, result) => {
            if (err) {
                console.log(err);
                res.json({ message: "Student not deleted" });
            } else {
                res.status(200).json({ message: "Student deleted successfully" });
            }
        });
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = studentsRouter;