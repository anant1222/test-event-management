const express = require("express");
const router = express.Router();
const questionsController = require("../controllers/questionsController");
const authMiddleware = require('../middlewares/authMiddleware'); 


router.post("/", authMiddleware.authenticate, questionsController.createQuestion);
router.get("/:uniqueId", authMiddleware.authenticate, questionsController.getQuestion);
router.patch("/:uniqueId", authMiddleware.authenticate, questionsController.updateQuestion);
router.get("/", authMiddleware.authenticate, questionsController.getAllQuestions);



module.exports = router;
