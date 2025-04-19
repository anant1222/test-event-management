const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/dbConnection");

class Question extends Model {}

Question.init(
    {
        uniqueId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            unique: true,
            allowNull: false,
        },
        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "categories", // name of the Category model
                key: "id", // key in the Category model
            },
        },
        questionText: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        complexity: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        score: {
            type: DataTypes.DECIMAL(5, 2),
            defaultValue: 0.0,
        },
        createdAt: {
            type: DataTypes.BIGINT,
            allowNull: false,
            get() {
                // Get the Unix timestamp in milliseconds
                return this.getDataValue("createdAt");
            },
            set(value) {
                // Set the Unix timestamp in milliseconds
                this.setDataValue("createdAt", value);
            },
        },
        updatedAt: {
            type: DataTypes.BIGINT,
            allowNull: false,
            get() {
                // Get the Unix timestamp in milliseconds
                return this.getDataValue("updatedAt");
            },
            set(value) {
                // Set the Unix timestamp in milliseconds
                this.setDataValue("updatedAt", value);
            },
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        sequelize,
        modelName: "Question",
        tableName: "questions",
        timestamps: true,
        hooks: {
            beforeCreate: (question, options) => {
                const now = Date.now();
                question.createdAt = now;
                question.updatedAt = now;
            },
            beforeUpdate: (question, options) => {
                question.updatedAt = Date.now();
            },
        },
    }
);

module.exports = Question;
