const pool = require('../db');
const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const users = require('../controllers/users.controller');

const privatekey = 'hitlerwithoutmostache9988';
const checkAuth = require('../middleware/check-auth');


//routes
//create a user
router.post('/register', users.save);

router.post('/login', users.login);


//update a user need to be login first
// router.patch('/change',async(req,res, next)=>{
//     try{


//     }catch{
//         res.status(500).json({
//             message: err.message
//         })
//     }
// })



//delete a user
// router.delete('/:userid', (req,res,next)=>{
//     if

// })











module.exports = router;