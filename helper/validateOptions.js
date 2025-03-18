const validateOptions = (data) => {
    const errors = [];

    if (!data.questionUniqueId) {
        errors.push("questionId is required");
    }

    if (!Array.isArray(data.options) && data.options.length === 0) {
        errors.push("options must be an array");
    } else if (data.options.length !== 4) {
        errors.push("four options must be given.");
    } else {
        data.options.forEach((option, index) => {
            if (!option.optionText) {
                errors.push(
                    `optionText is required for option at index ${index}`
                );
            }
            if (typeof option.isCorrect !== "boolean") {
                errors.push(
                    `isCorrect must be a boolean for option at index ${index}`
                );
            }
        });
    }

    return errors;
};


module.exports = validateOptions;