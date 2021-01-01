const user = require('../models').Users;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const privatekey = 'ky2AM^wWKq8whN1v#l8*BPi333eOwoe7';
const checkAuth = require('../middleware/check-auth');
const Op = require('Sequelize').Op;

exports.save = (req, res, next) => {
    const userData = {
        email: req.body.email,
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: bcrypt.hashSync(req.body.password, 10, (err, hash) => {
            if (err) {
                console.log(err);
                res.status(500).json({
                    message: "HASH ",
                    error: err.message
                })
            } else {
                return hash;

            }
        }),
        status: true
    }

    user.findOne({
            where: {
                email: req.body.email
            }
        }).then(users => {
            if (!users) {
                user.create(userData)
                    .then(user => {
                        res.json({ status: user.email + " is registered" });
                    }).catch(err => {
                        res.send("Error: " + err)
                    })
            } else {
                res.json({ error: 'User Already Exist' })
            }
        })
        .catch(err => {
            res.send("Error: " + err)
        })
}

exports.login = (req, res, next) => {
    try {
        if (req.body.email || req.body.username) {
            user.findOne({
                where: {
                    [Op.or]: [{ email: req.body.email ? req.body.email : null }, { username: req.body.username ? req.body.username : null }]
                }
            }).then(users => {
                console.log("users: ", users);
                bcrypt.compare(req.body.password, users.password, (err, result) => {
                    if (err) {
                        res.status(401).json({
                            message: 'Authentication Failed'
                        })
                    }
                    if (result) {
                        const token = jwt.sign({
                            email: users.email,
                            userId: users.id
                        }, privatekey, {
                            expiresIn: '1h'
                        })
                        return res.status(200).json({
                            message: "Authentication Successful",
                            token: token
                        })
                    }
                })
            })
        } else {
            res.status(401).json({
                message: "Authentication failed"
            })
        }
    } catch (err) {
        res.status(500).json({
            message: "Login Failed",
            error: err.message
        });
    }
}