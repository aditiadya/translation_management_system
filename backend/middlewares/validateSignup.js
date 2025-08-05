import { body, validationResult } from 'express-validator';

export const validateSignup = [
  body('email').isEmail().withMessage('A valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('account_type').isIn(['enterprise', 'freelance']).withMessage('Invalid account type'),
  body('company_name').notEmpty().withMessage('Company name is required'),
  body('country').notEmpty().withMessage('Country is required'),
  body('time_zone').notEmpty().withMessage('Time zone is required'),
  body('first_name').notEmpty().withMessage('First name is required'),
  body('last_name').notEmpty().withMessage('Last name is required'),
  body('username').notEmpty().withMessage('Username is required'),
  body('phone').notEmpty().withMessage('Phone number is required'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
