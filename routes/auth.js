const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const signupController = require('../controllers/signupController');
const loginController = require('../controllers/loginController');
const authMiddleware = require('../middlewares/authMiddleware');


// Signup route
router.post('/signup', signupController.signup);

// Login route
router.post('/login', loginController.login);

// // Google OAuth routes
// router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// router.get('/google/callback', 
//   passport.authenticate('google', { failureRedirect: '/auth/login' }),
//   (req, res) => {
//     // Successful authentication, redirect to your desired route
//     res.redirect('/');
//   }
// );

module.exports = router;
