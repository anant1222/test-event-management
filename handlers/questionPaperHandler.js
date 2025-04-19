const responseHandler = require("../handlers/responseHandler");
const errorMessages = require("../config/errorMessages.json");
const { getQuestionPaperData } = require("../config/nativeQueries");
const query = require("../helper/dbHelper.js");
const _ = require("lodash");
module.exports = {
    getAllQuestionPapers: async () => {
        try {
            const questionPaper = await query(getQuestionPaperData);
            if (!questionPaper) {
                return responseHandler.sendResponse(
                    res,
                    errorMessages.fetchError,
                    null,
                    false
                );
            }

            const groupedData = _.groupBy(questionPaper, "uniqueId");

            // Transform the grouped data to get the desired output
            const result = _.map(groupedData, (items, uniqueId) => {
                const questionSharedCount = items.length > 1 ? items.length : ((items.length === 1 && !!items[0].userId) ? 1 : 0); 
                
                const attemptedCount = _.sumBy(items, "isAttempted") || 0;
                const {
                    testName,
                    duration,
                    minMarksToQualify,
                    maxMarks,
                    isResultDisplay,
                } = items[0];

                return {
                    questionPaperId: uniqueId,
                    questionSharedCount,
                    attemptedCount,
                    testName,
                    duration,
                    minMarksToQualify,
                    maxMarks,
                    isResultDisplay,
                };
            });

            return result;
        } catch (error) {
            throw error;
        }
    },
};
