const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/dbConnection");

class UserScore extends Model {}

UserScore.init(
    {
        uniqueId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            unique: true,
            allowNull: false,
        },
        correctCount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        incorrectCount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        score: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        isPasses: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        totalAttempt: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        questionPaperId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.BIGINT,
            allowNull: false,
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
            get() {
                return this.getDataValue("updatedAt");
            },
            set(value) {
                this.setDataValue("updatedAt", value);
            },
        },
    },
    {
        sequelize,
        modelName: "UserScore",
        tableName: "userScore",
        timestamps: true,
        hooks: {
            beforeCreate: (userScore, options) => {
                const now = Date.now();
                userScore.createdAt = now;
                userScore.updatedAt = now;
            },
            beforeUpdate: (userScore, options) => {
                userScore.updatedAt = Date.now();
            },
        },
    }
);

module.exports = UserScore;
