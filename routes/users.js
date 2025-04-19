var express = require('express');
var router = express.Router();
var dbHelper = require('../helper/dbHelper');
var nativeQueries = require('../config/nativeQueries')
var successMessages = require('../config/successMessages.json')
var responseHandler = require('../handlers/responseHandler');
const scoreController = require('../controllers/scoreController');
const loginController = require('../controllers/loginController');
const questionController = require('../controllers/questionsController');
const questionPaperController = require('../controllers/questionPaperController');
const authMiddleware = require('../middlewares/authMiddleware');


/* GET users tests. */
router.post('/score', authMiddleware.authenticate, scoreController.calculateScore);
;
/* GET users tests. */
router.get('/userQuestions',authMiddleware.authenticate, questionPaperController.getUserAllQuestions);
;
/* GET users tests papers. */
router.get('/userQuestionPapers',authMiddleware.authenticate, questionPaperController.getUserQuestionPaper);
;

/* GET all paper attempted users. */
router.get('/attemptedPapers',authMiddleware.authenticate, questionPaperController.getUsersAttemptedPapers);
;


module.exports = router;
