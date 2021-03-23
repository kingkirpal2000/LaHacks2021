const express = require("express");
const router = express.Router();
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = require("../database/connect.js");
const users = db.get('users');
users.createIndex("username", { unique: true });

require('dotenv').config();

const Signupschema = Joi.object().keys({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'edu'] } }).required(),
    password: Joi.string().required(),
});

const Loginschema = Joi.object().keys({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'edu'] } }).required(),
    password: Joi.string().required(),
});

router.get("/", (req, res) => {
    res.json({
        message: "Auth-Router Connected",
    });
});

function createToken(user, req, res, next) {
    const payload = {
        _id: user._id,
        email: user.email,
    };

    jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '1d' }, (err, token) => {
        if (err) {
            console.log(err);
            res.status(422);
            const error = new Error("Error Signing in User");
            next(error);
        } else {
            res.json({ token });
        }
    });
}

router.post("/newcoder", (req, res, next) => {
    const result = Signupschema.validate(req.body);
    if (result.error) {
        res.status(406);
        const error = new Error("Invalid Credentials");
        next(error);
    } else {
        users.findOne({
            email: req.body.email
        }).then((user) => {
            if (user) {
                const error = new Error("User with this email already exists");
                //res.status(409);
                next(error);
            } else {
                bcrypt.hash(req.body.password, 12).then((hashedPassword) => {
                    const insertUser = {
                        email: req.body.email,
                        password: hashedPassword,

                    };
                    users.insert(insertUser).then((insertedUser) => {
                        createToken(insertedUser, req, res, next);
                    });
                });
            }
        });
    }
});

router.post("/returningcoder", (req, res, next) => {
    const result = Loginschema.validate(req.body);
    if (result.error) {
        const err = new Error("Invalid Credentials");
        next(error);
    } else {
        users.findOne({ email: req.body.email }).then((foundUser) => {
            if (foundUser) {
                bcrypt.compare(req.body.password, foundUser.password, (err, result) => {
                    if (err) {
                        const error = new Error("Error Signing in User.");
                        next(error);
                    } else {
                        if (result) {
                            createToken(foundUser, req, res, next);
                        }
                    }
                });
            } else {
                const error = new Error("No user found...");
                next(error);
            }
        });
    }
});


module.exports = router;
