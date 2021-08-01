const express = require('express');
const router = express.Router();
const { signup, signin, addCourse, boughtCourses } = require('../controller/authController');
const { signupValidationRules, userSigninValidation, validate } = require('../validator/validation');

// User signup and signin route
router.post('/signup', signupValidationRules(), validate, signup);
router.post('/signin', userSigninValidation(), validate, signin);
router.post('/addCourse', addCourse);
router.get('/boughtCourses/:id', boughtCourses);



module.exports = router;