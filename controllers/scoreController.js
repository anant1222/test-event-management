
const { v4: uuidv4 } = require('uuid'); 
const responseHandler = require('../handlers/responseHandler');
const errorMessages = require('../config/errorMessages.json');
const successMessages = require('../config/successMessages.json');
const requestParams = require('../config/requestParams.json');
const requestParamsHandler = require('../handlers/requestParamsHandler.js');
const UserScore = require('../models/userScore.js');
const QuestionPaper = require('../models/questionPaper.js');
const TestParticipant = require('../models/testParticipants.js');

async function calculateScore(req, res) {
    try {
        const reqParams = req.body;
    await requestParamsHandler.validateNew(Object.keys(reqParams), requestParams.fetchScore);
    const answers = reqParams.answers
    let questionPaper = await QuestionPaper.findOne({
        where: { uniqueId: reqParams.questionPaperId }
    });
    questionPaper = questionPaper.dataValues

    let correctCount = 0;
    let incorrectCount = 0;
    let totalScore = 0;
    let totalAttempt = answers.filter(answer => answer.selectedOptionId !== null).length;
    const passingMarks = questionPaper.passingMarks;
  
    // Map question IDs to their details for easy lookup
    const questionMap = new Map();
    questionPaper.questionsData.forEach(question => {
      questionMap.set(question.id, question);
    });
  
    // Process each answer to calculate correct/incorrect counts and total score
    answers.forEach(answer => {
      const question = questionMap.get(answer.questionId);
  
      if (question) {
        // Check if the selected option is correct
        if (answer.selectedOptionId === question.options.find(option => option.id === answer.correctOptionId)?.id) {
          correctCount++;
          totalScore += question.marks;
        } else {
          incorrectCount++;
        }
      }
    });
    const isPasses = totalScore >= passingMarks;
    const response =  {
      correctCount,
      incorrectCount,
      score: totalScore,
      isPasses,
      totalAttempt,
      questionPaperId: reqParams.questionPaperId,
      userId: req.user.id
    };
    await UserScore.create({
        uniqueId: uuidv4(), 
        correctCount,
        incorrectCount,
        score: totalScore,
        isPasses,
        totalAttempt,
        questionPaperId: reqParams.questionPaperId,
        userId: req.user.id
    });

    await TestParticipant.update(
        { isAttempted: 1},
        {
          where: {
            userId: req.user.id,
          },
        }
      );
    
    if(questionPaper.isResultDisplay){
        responseHandler.sendResponse(res, successMessages.scoreFetched, response);
    }
    else{
        responseHandler.sendResponse(res, successMessages.scoreFetched, successMessages.resultWillBeDeclaredLater);
    }
    } catch (error) {
        console.error('Error during fetching score:', error);
        responseHandler.sendResponse(res,  'An error occurred fetching score', null, false);
    }

}
    

module.exports = { calculateScore };
