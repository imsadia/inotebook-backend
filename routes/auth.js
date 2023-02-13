const express = require("express");
const { body, validationResult } = require('express-validator');
const User = require("../models/User");
const router = express.Router();

// Create a User using: POST "/api/auth/". Doesn't Require Auth.
router.post(
  "/",
  [
    body("name", "Name must contain at least 3 characters.").isLength({
      min: 3,
    }),
    body("email", "Email must be valid address.").isEmail(),
    body("password", "Password must contain at least 5 characters.").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Create user record in the database
    User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    })
      .then((user) => res.json(user))
      .catch((error) => res.json({'error': 'Please enter valid data.', 'message': error.message}));
  }
);

module.exports = router;
