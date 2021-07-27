const express = require('express');
const router = express.Router();
const { signup, signin } = require('../controller/authController');
const { signupValidationRules, userSigninValidation, validate } = require('../validator/validation');

// User signup and signin route
router.post('/signup', signupValidationRules(), validate, signup);
router.post('/signin', userSigninValidation(), validate, signin);



module.exports = router;