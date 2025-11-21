import { body, validationResult } from 'express-validator';

export const validateActivation = [
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

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];