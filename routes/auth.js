const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'shhhhh';

// Create a User using: POST "/api/auth/". Doesn't Require Auth.
router.post(
  "/create",
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

    // Try catch blocks to catch any exception if try block fails
    try {
      // Get user with the email in request from database
      let user = await User.findOne({ email: req.body.email });

      // If user already exists then return error
      if (user) {
        return res
          .status(400)
          .json({ error: "User with this email address already exists!" });
      }

      // Securing user password using bcryptjs
      const salt = await bcrypt.genSalt(10);
      const securePassword = await bcrypt.hash(req.body.password, salt);

      // Create user record in the database
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securePassword,
      });


      // Get user id from user object
      const data = {
        user: {
          id: user.id
        }
      };

      // Sign wiht jwt to get the token
      const token = jwt.sign(data, JWT_SECRET);

      // Return token to the user
      res.json({ token: token });
    } catch (error) {
      return res.status(500).json({ error: "Some error has occurred!", message: error.message });
    }
  }
);

module.exports = router;
