// Auth routes
// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login, confirmEmail } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/confirm-email/:token', confirmEmail);


module.exports = router;
