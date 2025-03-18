module.exports = {
    category: ["uniqueId", "name", "description", "isActive"],
    question: [
        "uniqueId",
        "categoryUniqueId",
        "questionText",
        "complexity",
        "score",
        "isActive",
    ],
    option: ["uniqueId", "questionUniqueId", "optionText", "isCorrect"],
};