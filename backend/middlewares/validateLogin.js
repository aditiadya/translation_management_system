import { body, validationResult } from "express-validator";

export const validateLogin = [
  body("identifier")
    .notEmpty()
    .withMessage("Email or Username is required")
    .custom((value) => {
      if (value.includes("@")) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          throw new Error("A valid email is required");
        }
      }
      return true;
    }),
  body("password").notEmpty().withMessage("Password is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
