const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const authMiddleware = require('../middlewares/authMiddleware'); 

router.post("/", authMiddleware.authenticate, categoryController.createCategory);
router.get("/all",  authMiddleware.authenticate, categoryController.getAllCategories);
router.patch("/edit", authMiddleware.authenticate, categoryController.editCategory);


module.exports = router;
