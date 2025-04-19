const Category = require("../models/category");
const Question = require("../models/question");

const responseHandler = require("../handlers/responseHandler");
const successMessages = require("../config/successMessages.json");
const errorMessages = require("../config/errorMessages.json");
const filterKeys = require("../config/filterKeys");
const filterHandler = require('../handlers/filterHandler');
const questionHandlers = require('../handlers/questionsHandler');
const _ = require('lodash');
const { Op } = require('sequelize');

async function getQuestion(req, res) {
    try {
        const { uniqueId } = req.params;

        if (!uniqueId) {
            return responseHandler.sendResponse(
                res,
                errorMessages.uniqueIdRequired,
                null,
                false
            );
        }

        const filteredQuestion = await questionHandlers.getQuestionById(
            uniqueId
        );
        responseHandler.sendResponse(res, successMessages.questionFetched, {
            question: filteredQuestion,
        });
    } catch (error) {
        console.error("Error fetching question:", error.message, error);
        responseHandler.sendResponse(
            res,
            errorMessages.fetchError,
            null,
            false
        );
    }
}


async function getAllQuestions(req, res) {
    try {
        const { categoryId } = req.query;
        if (!categoryId) {
             return responseHandler.sendResponse(
                 res,
                 errorMessages.categoryIdRequired,
                 null,
                 false
             );
        }
        const filteredQuestions = await questionHandlers.getQuestionsByCategory(categoryId);
        responseHandler.sendResponse(res, successMessages.questionsFetched, {
            questions: filteredQuestions,
        });
    } catch (error) {
        console.error("Error fetching questions:", error.message, error);
        responseHandler.sendResponse(
            res,
            errorMessages.fetchError,
            null,
            false
        );
    }
}

async function getCategoryIdByUniqueId(uniqueId) {
    const category = await Category.findOne({ where: { uniqueId } });
    return category ? category.id : null;
}

async function createQuestion(req, res) {
    try {
        const { categoryUniqueId, questionText, complexity, score } = req.body;

        if (!categoryUniqueId || !questionText || !complexity) {
            return responseHandler.sendResponse(
                res,
                errorMessages.missingFields,
                null,
                false
            );
        }

        const categoryId = await getCategoryIdByUniqueId(categoryUniqueId);

        if (!categoryId) {
            return responseHandler.sendResponse(
                res,
                errorMessages.categoryNotFound,
                null,
                false
            );
        }

        let question = await Question.create({
            categoryId,
            questionText,
            complexity,
            score,
        });

        question = filterHandler.keepKeys(
            question.toJSON(),
            filterKeys.question
        );

        responseHandler.sendResponse(res, successMessages.questionCreated, {
            question,
        });
    } catch (error) {
        console.error("Error creating question:", error.message, error);
        responseHandler.sendResponse(
            res,
            errorMessages.creationError,
            null,
            false
        );
    }
}

async function updateQuestion(req, res) {
    try {
        const { uniqueId } = req.params;
        const { questionText, complexity, score, isActive } = req.body;

        if (!uniqueId) {
            return responseHandler.sendResponse(
                res,
                errorMessages.uniqueIdRequired,
                null,
                false
            );
        }

        const question = await Question.findOne({ where: { uniqueId } });

        if (!question) {
            return responseHandler.sendResponse(
                res,
                errorMessages.questionNotFound,
                null,
                false
            );
        }

        await question.update({
            questionText,
            complexity,
            score,
            isActive,
        });

        const updatedQuestion = filterHandler.keepKeys(
            question.toJSON(),
            filterKeys.question
        );
        responseHandler.sendResponse(res, successMessages.questionUpdated, {
            question: updatedQuestion,
        });
    } catch (error) {
        console.error("Error updating question:", error.message, error);
        responseHandler.sendResponse(
            res,
            errorMessages.updateError,
            null,
            false
        );
    }
}


module.exports = {
    createQuestion,
    getQuestion,
    updateQuestion,
    getAllQuestions,
};
