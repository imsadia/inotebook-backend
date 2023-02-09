const express = require('express');
const User = require('../models/User');
const router = express.Router();


// Create a User using: POST "/api/auth/". Doesn't Require Auth.
router.get('/', async (req, res) => {
    const user = User(req.body);
    await user.save();
    res.json(user);
});

module.exports = router;