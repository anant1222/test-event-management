const adminHandler = require("../handlers/adminHandler");
const responseHandler = require("../handlers/responseHandler");
const errorMessages = require("../config/errorMessages.json");
const successMessages = require("../config/successMessages.json");
const mailHelper = require("../helper/mailHelper");
const User = require("../models/user.js");
const TestParticipant = require("../models/testParticipants.js");
const QuestionPaper = require("../models/questionPaper.js");
const requestParamsHandler = require('../handlers/requestParamsHandler.js');
const requestParams = require('../config/requestParams.json');
const _ = require("lodash");
require("dotenv").config();



const sendQuestionPaperInviteToUsers = async (req, res) => {
    try {
        const { questionPaperId, users } = req.body;
        if (_.isEmpty(questionPaperId) || _.isEmpty(users)) {
            return responseHandler.sendResponse(
                res,
                errorMessages.allFieldsRequired,
                null,
                false
            );
        }
        const questionPaper = await QuestionPaper.findOne({
            where: { uniqueId: questionPaperId },
        });
        for (const userEmail of users) {
            const user = await User.findOne({
                where: {
                    email: userEmail,
                },
            });
            await TestParticipant.create({
                userId: user.dataValues.id,
                questionPaperId: questionPaperId,
            });
            const email_data = {
                userFirstName: user.dataValues.name,
                websiteName: process.env.APP_NAME,
                testName: questionPaper.dataValues.testName,
                duration: questionPaper.dataValues.duration,
                questions: questionPaper.dataValues.questionsData.length,
                websiteUrl: process.env.APP_URL,
            };
            mailHelper.sendMail(
                userEmail,
                process.env.MAIL_TYPE_QUESTION_PAPER,
                email_data
            );
        }
        responseHandler.sendResponse(
            res,
            successMessages.emailSentSuccessfully
        );
    } catch (err) {
        console.error("Error during question generation:", err.message);
        responseHandler.sendResponse(
            res,
            errorMessages.serverError,
            null,
            false
        );
    }
};

const generateQuestions = async (req, res) => {
  try {
    const reqParams = req.body;
    await requestParamsHandler.validateNew(Object.keys(reqParams), requestParams.generateQuestions);
    const { category } = req.body;
    const questions = await adminHandler.generateQuestionsHandler(category);
    responseHandler.sendResponse(res, successMessages.questionsGenerated, { questions });
  } catch (err) {
    console.error('Error during question generation:', err.message);
    responseHandler.sendResponse(res, errorMessages.serverError, null, false);
  }
};

const generateQuickQuestions = async (req, res) => {
  try {
    const reqParams = req.body;
    await requestParamsHandler.validateNew(Object.keys(reqParams), requestParams.generateQuickQuestions);
    const { category, difficulty, totalQuestion } = req.body;

    const questions = await adminHandler.generateQuickQuestionsHandler(category, difficulty, totalQuestion);
    responseHandler.sendResponse(res, successMessages.questionsGenerated, questions );
  } catch (err) {
    console.error('Error during question generation:', err.message);
    responseHandler.sendResponse(res, errorMessages.serverError, null, false);
  }
};


const storeQuickQuestions = async (req, res) => {
  try {
    const reqParams = req.body;
    await requestParamsHandler.validateNew(Object.keys(reqParams), requestParams.storeQuickQuestions);
    const {questions,totalMarks,passingMarks,totalDuration,maxTabSwitchAttempts,displayResultAfterSubmit,userId,testName,category,difficulty} = req.body;

    // Create a new QuestionPaper record
    const newQuestionPaper = await QuestionPaper.create({
      userId,
      testName,
      duration: totalDuration,
      minMarksToQualify: passingMarks,
      maxMarks: totalMarks,
      questionsData: questions,
      isResultDisplay: displayResultAfterSubmit,
      maxTabSwitchAttempts: maxTabSwitchAttempts
  });

  responseHandler.sendResponse(res, successMessages.questionSetSaved, newQuestionPaper);
  } catch (err) {
    console.error('Error during saving question set:', err);
    responseHandler.sendResponse(res, errorMessages.serverError, null, false);
  }
};



module.exports = { generateQuestions , generateQuickQuestions, storeQuickQuestions, sendQuestionPaperInviteToUsers};
