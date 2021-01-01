const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const pool = require('./db');
const request = require('request');
const PORT = process.env.PORT || 5000;


const userRoutes = require('./routes/user');
const animeRoutes = require('./routes/anime');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers',
        "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});
    }
    next();
})

app.use(express.json()) //=>req.body
app.use('/user', userRoutes);
app.use('/anime', animeRoutes);


app.listen(PORT, () => {
    console.log("server is listening to port ",PORT);
});

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;