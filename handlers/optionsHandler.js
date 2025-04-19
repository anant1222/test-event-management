const Question = require("../models/question");
const Options = require("../models/options");

const responseHandler = require("../handlers/responseHandler");
const errorMessages = require("../config/errorMessages.json");
const filterKeys = require("../config/filterKeys");
const filterHandler = require("../handlers/filterHandler");

async function createOptions(questionUniqueId, options) {
    // Find the question by uniqueId
    let question = await Question.findOne({
        where: { uniqueId: questionUniqueId },
    });

    if (!question) {
        return responseHandler.sendResponse(
            res,
            errorMessages.questionNotFound,
            null,
            false
        );
    }

    // Delete all existing options for the question
    await Options.destroy({
        where: { questionId: question.id },
    });

    // Create new options in the database
    const createdOptions = await Options.bulkCreate(
        options.map((option) => ({
            questionId: question.id, // Use the question's ID
            optionText: option.optionText,
            isCorrect: option.isCorrect,
        }))
    );

    const filteredOptions = createdOptions.map((option) =>
        filterHandler.keepKeys(option.toJSON(), filterKeys.option)
    );
    return filteredOptions;
}

module.exports = {
    createOptions,
};
