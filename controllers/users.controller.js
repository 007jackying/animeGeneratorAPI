const user = require('../models').Users;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const privatekey = 'ky2AM^wWKq8whN1v#l8*BPi333eOwoe7';
const checkAuth = require('../middleware/check-auth');
const Op = require('sequelize').Op;

exports.save = (req, res, next) => {
    console.log('coming in',req.body);
    const package = req.body;
    const userData = {
        email: package.email,
        username: package.username,
        firstName: package.firstName,
        lastName: package.lastName,
        password: bcrypt.hashSync(package.password, 10, (err, hash) => {
            if (err) {
                console.log(err);
                res.status(500).json({
                    status: "HASH ",
                    error: err.message
                })
            } else {
                return hash;

            }
        }),
        status: true
    }

   const validate = user.findOne({
            where: {
                email: package.email
            }
        }).then(users => {
            if (!users) {
                user.create(userData)
                    .then(user => {
                        res.status(201).json({ status: user.email + " is registered" });
                    }).catch(err => {
                        res.send("Error: " + err)
                    })
            } else {
                console.log("User Already Exist")
                res.send({ status: 'User Already Exist' })
            }
        })
        .catch(err => {
            res.status(500).json({status: "Failed to register! Server Error(Please email dreamerofjack@gmail.com for assistance)"})
        })
    console.log("find result (register):",validate);
}

exports.login = (req, res, next) => {
    console.log('someone is trying to login',req.body);
    try {
        if (req.body.email || req.body.username) {
          const validate =  user.findOne({
                where: {
                    [Op.or]: [{ email: req.body.email ? req.body.email : null }, { username: req.body.username ? req.body.username : null }]
                }
            }).then(users => {
                // console.log("users: ", users);
                bcrypt.compare(req.body.password, users.password, (err, result) => {
                    if (err) {
                        console.log("Authentication failed, password")
                        res.send({
                            status: 'Authentication Failed'
                        })
                    }
                    if (result) {
                        const token = jwt.sign({
                            email: users.email,
                            userId: users.id
                        }, privatekey, {
                            expiresIn: '1h'
                        })
                        console.log("Authentication successful, token sent")
                        return res.send({
                            status: "Authentication Successful",
                            accessToken: token
                        })
                    }
                })
            })
            console.log("====================================");
            console.log("validate data (login), ",validate);
        } else {
            console.log("Authentication failed not sure")
            res.send({
                status: "Authentication failed"
            })
        }
    } catch (err) {
        console.log("Authentication failed, not sure")
        res.send({
            status: "Login Failed",
            error: err.message
        });
    }
}