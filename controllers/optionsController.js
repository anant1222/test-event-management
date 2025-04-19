
const responseHandler = require("../handlers/responseHandler");
const successMessages = require("../config/successMessages.json");
const errorMessages = require("../config/errorMessages.json");
const optionsHandlers = require("../handlers/optionsHandler");
const validateOptions = require("../helper/validateOptions");
const _ = require("lodash");

async function createOptions(req, res) {
    const { questionUniqueId, options } = req.body;

    // Validate input
    const validationErrors = validateOptions(req.body);
    if (validationErrors.length) {
        return responseHandler.sendResponse(
            res,
            errorMessages.validationFailed,
            { errors: validationErrors },
            false
        );
    }

    try {
        filteredOptions = await optionsHandlers.createOptions(
            questionUniqueId,
            options
        );

        responseHandler.sendResponse(
            res,
            successMessages.optionsCreated,
            { options: filteredOptions },
            true
        );
    } catch (error) {
        console.error("Error creating options:", error.message);
        responseHandler.sendResponse(
            res,
            errorMessages.createError,
            null,
            false
        );
    }
}

module.exports = {
    createOptions,
};
