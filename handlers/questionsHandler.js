

const responseHandler = require("../handlers/responseHandler");
const errorMessages = require("../config/errorMessages.json");
const {
    getQuestionDataById,
    getAllQuestion,
} = require("../config/nativeQueries");
const query = require("../helper/dbHelper");
const _ = require("lodash");


async function getQuestionById(questionUniqueId) {
    try {
        let question = await query(getQuestionDataById, [questionUniqueId]);

        if (!question) {
            return responseHandler.sendResponse(
                res,
                errorMessages.questionNotFound,
                null,
                false
            );
        }
        const transformedData = transformQuestions(question);

        return transformedData;
    } catch (error) {
        throw error;
    }
}

async function getQuestionsByCategory(categoryUniqueId) {
    try {
        let question = await query(getAllQuestion, [categoryUniqueId]);

        if (!question) {
            return responseHandler.sendResponse(
                res,
                errorMessages.questionNotFound,
                null,
                false
            );
        }
        const transformedData = transformQuestions(question);

        return transformedData;
    } catch (error) {
        throw error;
    }
}

async function transformQuestions(questions) {
    try {
        const groupedData = _.groupBy(questions, "questionId");
        const transformedData = _.map(groupedData, (questions, key) => {
            const question = questions[0]; // All questions in the group have the same text, difficulty, etc.
            let correctOptionId = null; // Initialize the correct option ID

            const options = questions.map((q) => {
                if (q.isCorrect) {
                    correctOptionId = q.optionId; // Store the correct option ID
                }
                return {
                    id: q.optionId,
                    text: q.optionText,
                };
            });

            return {
                id: key,
                text: question.questionText,
                marks: parseFloat(question.marks),
                difficulty: question.difficulty,
                options,
                answer: correctOptionId, // Include the correct option ID
            };
        });

        return transformedData;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getQuestionById,
    getQuestionsByCategory,
};