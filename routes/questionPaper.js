var express = require("express");
var router = express.Router();

const questionPaperController = require("../controllers/questionPaperController");
const authMiddleware = require("../middlewares/authMiddleware");


router.get(
    "/all",
    authMiddleware.authenticate,
    questionPaperController.getAllQuestionPapers
);
module.exports = router;
