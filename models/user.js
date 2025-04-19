const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/dbConnection'); // Adjust path as needed

class User extends Model {}

User.init(
  {
    uniqueId: {
      type: DataTypes.CHAR(36),
      defaultValue: DataTypes.UUIDV4, // Automatically generate UUID
      unique: true,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    role: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    createdAt: {
      type: DataTypes.BIGINT,
      allowNull: false,
      get() {
        // Get the Unix timestamp in milliseconds
        return this.getDataValue('createdAt');
      },
      set(value) {
        // Set the Unix timestamp in milliseconds
        this.setDataValue('createdAt', value);
      }
    },
    updatedAt: {
      type: DataTypes.BIGINT,
      allowNull: false,
      get() {
        // Get the Unix timestamp in milliseconds
        return this.getDataValue('updatedAt');
      },
      set(value) {
        // Set the Unix timestamp in milliseconds
        this.setDataValue('updatedAt', value);
      }
    },
    deletedAt: {
      type: DataTypes.BIGINT,
      allowNull: true,
      get() {
        // Get the Unix timestamp in milliseconds or null
        return this.getDataValue('deletedAt');
      },
      set(value) {
        // Set the Unix timestamp in milliseconds or null
        this.setDataValue('deletedAt', value);
      }
    }
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    hooks: {
      beforeCreate: (user, options) => {
        const now = Date.now();
        user.createdAt = now;
        user.updatedAt = now;
      },
      beforeUpdate: (user, options) => {
        user.updatedAt = Date.now();
      }
    }
  }
);

module.exports = User;
