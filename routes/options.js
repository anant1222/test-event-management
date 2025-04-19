const express = require("express");
const router = express.Router();
const optionsController = require("../controllers/optionsController");
const authMiddleware = require('../middlewares/authMiddleware'); 

router.post("/", authMiddleware.authenticate,  optionsController.createOptions);

module.exports = router;
