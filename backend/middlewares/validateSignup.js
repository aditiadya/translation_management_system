import { body, validationResult } from 'express-validator';

export const validateSignup = [
  body('email')
    .isEmail()
    .withMessage('A valid email is required'),

  body('account_type')
    .isIn(['enterprise', 'freelance'])
    .withMessage('Invalid account type'),

  body('company_name')
    .custom((value, { req }) => {
      if (req.body.account_type === 'enterprise' && !value) {
        throw new Error('Company name is required for enterprise accounts');
      }
      return true;
    }),

  body('country')
    .notEmpty()
    .withMessage('Country is required'),

  body('time_zone')
    .notEmpty()
    .withMessage('Time zone is required'),

  body('first_name')
    .notEmpty()
    .withMessage('First name is required'),

  body('last_name')
    .notEmpty()
    .withMessage('Last name is required'),

  body('phone')
    .notEmpty()
    .withMessage('Phone number is required'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
