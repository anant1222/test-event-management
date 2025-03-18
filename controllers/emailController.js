const bcrypt = require("bcryptjs");
const dbHelper = require("../helper/dbHelper");
const responseHandler = require("../handlers/responseHandler");
const mailHelper = require("../helper/mailHelper");
var errorMessages = require("../config/errorMessages.json");
var successMessages = require("../config/successMessages.json");
const nativeQueries = require("../config/nativeQueries");
const User = require("../models/user.js");
const UserScore = require("../models/userScore.js");
const QuestionPaper = require("../models/questionPaper.js");
const _ = require("lodash");

async function sendEmail(req, res) {
    try {
        const { users } = req.body;
        console.log("::::::::::Sending Email API:::::::::::::");
        if (_.isEmpty(users)) {
            return responseHandler.sendResponse(
                res,
                errorMessages.allFieldsRequired,
                null,
                false
            );
        }
        for (const userEmail of users) {
            const user = await User.findOne({
                where: {
                    email: userEmail,
                },
            });
            console.log(user.dataValues);
            const userId = user.dataValues.id;
            const userScore = await UserScore.findOne({
                where: {
                    userId: userId,
                },
            });
            console.log(userScore.dataValues);
            const questionPaper = await QuestionPaper.findOne({
                where: { id: userScore.dataValues.questionPaperId },
            });
            console.log(questionPaper);
            const email_data = {
                userFirstName: user.dataValues.name,
                testName: questionPaper.dataValues.testName,
                websiteName: process.env.APP_NAME,
                userScore: userScore.dataValues.score,
                correctCount: userScore.dataValues.correctCount,
                totalAttempt: userScore.dataValues.totalAttempt,
                resultStatus: userScore.dataValues.isPasses ? "Pass" : "Failed",
                websiteUrl: process.env.APP_URL,
            };
            mailHelper.sendMail(userEmail, process.env.MAIL_TYPE_RESULT,email_data);
        }

        return responseHandler.sendResponse(
            res,
            successMessages.emailSentSuccessfully,
            null,
            true
        );
    } catch (err) {
        console.error("Error during sendEmail:", err.message);
        responseHandler.sendResponse(
            res,
            "An error occurred during sendEmail",
            null,
            false
        );
    }
}

module.exports = {
    sendEmail,
};
