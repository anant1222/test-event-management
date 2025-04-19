//admin routes
const express = require("express");
const adminController = require('../controllers/adminController');
const emailController = require('../controllers/emailController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Login route
router.post('/generate_question',authMiddleware.authenticate, adminController.generateQuestions);

router.post('/sendEmail',authMiddleware.authenticate, emailController.sendEmail);

router.post('/invite',authMiddleware.authenticate, adminController.sendQuestionPaperInviteToUsers);

router.post('/generate_question',authMiddleware.authenticate,  adminController.generateQuestions);

router.post('/generate_quick_question',authMiddleware.authenticate,  adminController.generateQuickQuestions);

router.post('/save_generate_quick_question',authMiddleware.authenticate,  adminController.storeQuickQuestions);

module.exports = router;
