
const responseHandler = require("../handlers/responseHandler");
const successMessages = require("../config/successMessages.json");
const errorMessages = require("../config/errorMessages.json");
const TestParticipant = require('../models/testParticipants.js');
const QuestionPaper = require('../models/questionPaper.js');
const { Op } = require('sequelize');
const requestParamsHandler = require('../handlers/requestParamsHandler.js');
const requestParams = require('../config/requestParams.json');
const query = require("../helper/dbHelper");
const nativeQueries = require('../config/nativeQueries.js')
const questionPaperHandler = require('../handlers/questionPaperHandler.js');
const _ = require('lodash')

// Get User All Questions
async function getUserAllQuestions(req, res) {
    try {
        const reqParams = req.query;
        await requestParamsHandler.validateNew(Object.keys(reqParams), requestParams.questionPaperDetails);

        // Fetch question papers
        let questionPapers = await TestParticipant.findAll({
            attributes: ['questionPaperId'],
            where: {
              userId: req.user.id,
              questionPaperId: reqParams.questionPaperId
            }
        });

        // Check if questionPapers is empty
        if (questionPapers.length === 0) {
            return responseHandler.sendResponse(
                res,
                successMessages.noQuestionsFound,
                [],
                true // You may want to return success but with no data
            );
        }

        // Extract questionPaperIds
        const questionPaperIds = questionPapers.map(record => record.questionPaperId);

        // Fetch question papers details
        let questionPapersDetails = await QuestionPaper.findAll({
            attributes: [
                ['uniqueId', 'questionPaperId'],
                ['duration', 'totalDuration'], 
                ['maxTabSwitchAttempts', 'maxTabSwitchAttempts'], 
                ['isResultDisplay', 'displayResultAfterSubmit'], 
                ['questionsData', 'questions'], 
                ['minMarksToQualify', 'passingMarks'], 
                ['maxMarks', 'totalMarks']
            ],
            where: {
              id: {
                [Op.in]: questionPaperIds,
              }
            },
            raw: true
        });

        // Check if questionPapersDetails is empty
        if (questionPapersDetails.length === 0) {
            return responseHandler.sendResponse(
                res,
                successMessages.noDetailsFound,
                [],
                true 
            );
        }

        // Process questions data
        questionPapersDetails.forEach(paper => {
            if (paper.questions) {
                paper.questions.forEach(question => {
                  delete question.answer; 
                  delete question.correctOptionId;
                });
            }
        });

        responseHandler.sendResponse(res, successMessages.questionsFetched, questionPapersDetails);  

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


// Get User Question data
async function getUserQuestionPaper(req, res) {
    try {
        // Fetch question papers for the user
        let questionPapers = await TestParticipant.findAll({
            attributes: ['questionPaperId'],
            where: {
              userId: req.user.id,
            }
        });

        if (questionPapers.length === 0) {
            return responseHandler.sendResponse(
                res,
                successMessages.noQuestionPapersFound,
                [],
                true 
            );
        }

        // Extract questionPaperIds
        const questionPaperIds = questionPapers.map(record => record.questionPaperId);

        // Fetch question papers details
        let questionPapersDetails = await QuestionPaper.findAll({
            attributes: [
                ['uniqueId', 'questionPaperId'],
                ['duration', 'totalDuration'], 
                ['testName', 'testName'],
                ['minMarksToQualify', 'passingMarks'], 
                ['maxMarks', 'totalMarks']
            ],
            where: {
              id: {
                [Op.in]: questionPaperIds,
              }
            },
            raw: true
        });

        // Check if questionPapersDetails is empty
        if (questionPapersDetails.length === 0) {
            return responseHandler.sendResponse(
                res,
                successMessages.noDetailsFound,
                [],
                true 
            );
        }

        responseHandler.sendResponse(res, successMessages.questionsFetched, questionPapersDetails);

    } catch (error) {
        console.error("Error fetching question papers:", error.message, error);
        responseHandler.sendResponse(
            res,
            errorMessages.fetchError,
            null,
            false
        );
    }
}

async function getAllQuestionPapers(req,res) {
    try {
      const result = await questionPaperHandler.getAllQuestionPapers();
      responseHandler.sendResponse(
          res,
          successMessages.questionsFetched,
          result
      );
    } catch (error) {
        console.error(
            "Error getAllQuestionPapers:",
            error.message,
            error
        );
        responseHandler.sendResponse(
            res,
            errorMessages.fetchError,
            null,
            false
        );
    }
}

// Get User who attempted papers
async function getUsersAttemptedPapers(req, res) {
    try {
        let question = await query(nativeQueries.getUserTestPapers, [req.user.id]);
        console.log(question)
        responseHandler.sendResponse(res, successMessages.userPapersFetched, question);
    } catch (error) {
        console.error("Error fetching questions:", error.message , error);
        responseHandler.sendResponse(
            res,
            errorMessages.fetchError,
            null,
            false
        );
    }
}


module.exports = {
    getUserAllQuestions,
    getUserQuestionPaper,
    getUsersAttemptedPapers,
    getAllQuestionPapers,
};
