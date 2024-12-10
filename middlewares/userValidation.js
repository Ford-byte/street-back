const { body, validationResult } = require('express-validator');

const validateUserLogin = [
    body('username')
        .notEmpty().withMessage('Username is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Password is required')
        .trim(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateUserRegistration = [
    body('fullname')
        .notEmpty().withMessage('Fullname is required')
        .matches(/^[a-zA-Z\s]+$/).withMessage('Fullname must contain only letters and spaces'),

    body('username')
        .isEmail().withMessage('Email is not valid'),

    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
        }
        next();
    }
];

module.exports = { validateUserLogin, validateUserRegistration };
