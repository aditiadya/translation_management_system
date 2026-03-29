import { body, validationResult } from 'express-validator';

export const validateVendorActivation = [
  body('username')
    .notEmpty()
    .withMessage('Username is required')
    .matches(/^[A-Za-z0-9.]+$/)
    .withMessage('Username can only contain letters, numbers, and dots')
    .isLength({ min: 6 })
    .withMessage('Username must be at least 6 characters'),

  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),

  body('confirm_password')
    .notEmpty()
    .withMessage('Confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),

  body('first_name')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('First name must not be empty'),

  body('last_name')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Last name must not be empty'),

  body('timezone')
    .optional()
    .trim(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
