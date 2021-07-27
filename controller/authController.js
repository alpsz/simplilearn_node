require('dotenv').config();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.SECRET;
const { sendSignupMail } = require('../utils/mail');

// User signup method
exports.signup = (req, res) => {
    const { email, password } = req.body;
    // encrypt password.
    bcrypt.hash(password, 12)
    .then((hashedPassword) => {
        const user = new User({
            email: email,
            password: hashedPassword
        });
        return user.save();
    }).then(user => {
        // [ Extra point ]: When user signup to the system welcome email send automatically by the system
        // for this I have use AWS SES service. 
        sendSignupMail(user.email);
        return res.status(200).json({
            success: 'Signup successfully.',
            user
        });
    }).catch((err) => {
        return res.status(422).json({
            error: err.message
        });
    });
};

// User login method
exports.signin = (req, res) => {
    const { email, password } = req.body;
    let loadedUser;
    User.findOne({
        email: email
    }).then((user) => {
        if (!user) {
            return res.status(401).json({
                error: 'A user with this email could not be found.'
            });
        }
        loadedUser = user;
        return bcrypt.compare(password, user.password);
    }).then((isEqual) => {
        if (!isEqual) {
            return res.status(401).json({
                error: 'Wrong password! Please enter your password again.'
            });
        }
        const token = jwt.sign({
            email: loadedUser.email,
            userId: loadedUser._id.toString()
        }, JWT_SECRET, { expiresIn: '3h' });
        return res.status(200).json({
            success: 'Signin successfully',
            token,
            userId: loadedUser._id.toString()
        });
    }).catch((err) => {
        return res.status(401).json({
            error: 'Something went wrong.'
        });
    });
};