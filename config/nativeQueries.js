module.exports = {
    addUser:
        "INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)",
    checkEmailExists: "SELECT * FROM users WHERE email = ?",
    getQuestionDataById:
        "SELECT q.questionText, q.score as 'marks', q.uniqueId as 'questionId', q.complexity as 'difficulty', o.optionText as 'optionText' , o.uniqueId as 'optionId' , o.isCorrect from questions q join `options` o on q.id = o.questionId where q.uniqueId = ?;",
    getAllQuestion:
        "SELECT q.questionText, q.score as 'marks', q.uniqueId as 'questionId', q.complexity as 'difficulty', o.optionText as 'optionText' , o.uniqueId as 'optionId' , o.isCorrect from questions q join `options` o on q.id = o.questionId join categories c on c.id = q.categoryId where c.uniqueId = ?;",

    getUserTestPapers:
        "SELECT u.name, u.email, qp.testName, us.isPasses AS isPassed FROM testParticipants tp JOIN questionPapers qp ON qp.id = tp.questionPaperId JOIN users u ON u.id = tp.userId JOIN userScore us ON us.questionPaperId = qp.id WHERE u.id = ?;",
    getQuestionPaperData:
        "SELECT qp.uniqueId, qp.testName, qp.duration,qp.minMarksToQualify, qp.maxMarks , qp.isResultDisplay, tp.userId, tp.isAttempted  FROM questionPapers qp left join testParticipants tp on tp.questionPaperId = qp.id;",
};
