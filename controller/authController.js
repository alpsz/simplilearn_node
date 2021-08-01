require('dotenv').config();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.SECRET;
const { sendSignupMail } = require('../utils/mail');

// User signup method
exports.signup = (req, res) => {
    const { email, password } = req.body;
    // encrypt password.
    const user = new User();
    user.email = email;
    user.setPassword(password);
    user.save((err, user) => {
        if (err) {
            return res.status(400).send({
                message : "Failed to add user.",
                ErrorMsg: err
            });
        }
        else {
            // [ Extra point ]: When user signup to the system welcome email send automatically by the system
            // for this I have use AWS SES service. 
            sendSignupMail(user.email);
            return res.status(200).json({
                success: 'Signup successfully.',
                user
            });
        }
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
        if (user.validPassword(req.body.password)) {
            const token = jwt.sign({
                email: loadedUser.email,
                userId: loadedUser._id.toString()
            }, JWT_SECRET, { expiresIn: '3h' });
            return res.status(200).json({
                success: 'Signin successfully',
                token,
                user: loadedUser
            });
        }
        else {
            return res.status(401).json({
                error: 'Email or password is invalid'
            });
        }
    }).catch((err) => {
        return res.status(401).json({
            error: 'Something went wrong.'
        });
    });
};

//Method to add the course
exports.addCourse = (req, res) => {
    const {courseId, userId} = req.body;
    User.findOne({_id: userId.toString()}) 
        .then((user) => {
            if (!user) {
                return res.status(401).json({
                    message: 'User not Found.'
                });
            }
            user.courses.push(courseId);
            user.save();
            return res.status(200).json({
                success: 'Course Added successfully.',
                courses: user.courses
            });
        })
        .catch((err) => {
            return res.status(401).json({
                error: 'Something went wrong.'
            });
        });
}

//Method to Fetch Bought Courses
exports.boughtCourses = (req, res) => {
    const userId = req.params.id;
    User.findOne({_id: userId.toString()})
    .then((user) => {
        if (!user) {
            return res.status(401).json({
                message: 'User not Found.'
            });
        }
        return res.status(200).json({
            success: 'Successfully fetched courses',
            courses: user.courses
        });
    })
    .catch((err) => {
        return res.status(401).json({
            error: 'Something went wrong.'
        });
    });

};