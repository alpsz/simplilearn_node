const { body, validationResult } = require('express-validator');

const signupValidationRules = () => {
    return [
        body('email')
        .notEmpty()
        .withMessage('Email cannot be empty')
        .isEmail()
        .withMessage('Please enter a valid email address'),
        body('password')
        .notEmpty()
        .withMessage('Password cannot be empty')
        .trim()
        .isLength({ min: 6 })
        .withMessage('Password should be at least 6 characters long')
    ]
};

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extrectedErrors = [];
    errors.array().map(err => extrectedErrors.push({ [err.param]: err.msg }))
    return res.status(422).json({
        errors: extrectedErrors
    });
};

const userSigninValidation = () => {
    return [
        body('email')
        .notEmpty()
        .withMessage('Email cannot be empty')
        .isEmail()
        .withMessage('Please enter a valid email address'),
        body('password')
        .notEmpty()
        .withMessage('Password cannot be empty')
        .trim()
    ]
};

module.exports = {
    signupValidationRules,
    validate,
    userSigninValidation
};