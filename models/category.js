// models/category.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/dbConnection");

class Category extends Model {}

Category.init(
    {
        uniqueId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            unique: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
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
    },
    {
        sequelize,
        modelName: "Category",
        tableName: "categories",
        timestamps: true,
        hooks: {
            beforeCreate: (category, options) => {
                const now = Date.now();
                category.createdAt = now;
                category.updatedAt = now;
            },
            beforeUpdate: (category, options) => {
                category.updatedAt = Date.now();
            },
        },
    }
);

module.exports = Category;
