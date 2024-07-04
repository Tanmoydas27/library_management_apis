const express = require('express');
const app = express();
require('dotenv').config();
const booksRouter = require('./routes/booksRoute.js');
const studentsRouter = require('./routes/studentsRoutes.js');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api',booksRouter);
app.use('/api',studentsRouter);


const PORT = process.env.PORT || 5000 ;
app.listen(PORT,()=>{
    console.log(`Servernis running in Port no ${PORT}`)
})