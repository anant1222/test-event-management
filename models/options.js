const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/dbConnection");
const Question = require("./question"); // Import the Question model for the foreign key relationship

class Option extends Model {}

Option.init(
    {
        uniqueId: {
            type: DataTypes.CHAR(36),
            defaultValue: DataTypes.UUIDV4,
            unique: true,
            allowNull: false,
        },
        questionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Question, // The model being referenced
                key: "id", // The key in the referenced model
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        optionText: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        isCorrect: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
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
        modelName: "Option",
        tableName: "options",
        timestamps: true,
        hooks: {
            beforeCreate: (option, options) => {
                const now = Date.now();
                option.createdAt = now;
                option.updatedAt = now;
            },
            beforeUpdate: (option, options) => {
                option.updatedAt = Date.now();
            },
        },
    }
);

module.exports = Option;
