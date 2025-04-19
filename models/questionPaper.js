const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/dbConnection");

class QuestionPaper extends Model {}

QuestionPaper.init(
    {
        uniqueId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            unique: true,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        testName: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'Name of the test',
        },
        createdAt: {
            type: DataTypes.BIGINT,
            allowNull: false,
            comment: 'Unix epoch timestamp in milliseconds',
            get() {
                return this.getDataValue("createdAt");
            },
            set(value) {
                this.setDataValue("createdAt", value);
            },
        },
        updatedAt: {
            type: DataTypes.BIGINT,
            allowNull: false,
            comment: 'Unix epoch timestamp in milliseconds',
            get() {
                return this.getDataValue("updatedAt");
            },
            set(value) {
                this.setDataValue("updatedAt", value);
            },
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        duration: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: 'Duration of the test in minutes',
        },
        minMarksToQualify: {
            type: DataTypes.DECIMAL(5, 2),
            defaultValue: 0.00,
        },
        maxMarks: {
            type: DataTypes.DECIMAL(5, 2),
            defaultValue: 0.00,
        },
        questionsData: {
            type: DataTypes.JSON,
            allowNull: true,
            comment: 'JSON data containing question details',
        },
        isResultDisplay: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        maxTabSwitchAttempts: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        modelName: "QuestionPaper",
        tableName: "questionPapers",
        timestamps: true,
        hooks: {
            beforeCreate: (questionPaper, options) => {
                const now = Date.now();
                questionPaper.createdAt = now;
                questionPaper.updatedAt = now;
            },
            beforeUpdate: (questionPaper, options) => {
                questionPaper.updatedAt = Date.now();
            },
        },
    }
);

module.exports = QuestionPaper;
