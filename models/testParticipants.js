const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/dbConnection");

class TestParticipant extends Model {}

TestParticipant.init(
  {
    uniqueId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users', 
        key: 'id',     
      },
    },
    questionPaperId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    isAttempted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    modelName: "TestParticipant",
    tableName: "testParticipants",
    timestamps: true,
    hooks: {
      beforeCreate: (testParticipant, options) => {
        const now = Date.now();
        testParticipant.createdAt = now;
        testParticipant.updatedAt = now;
      },
      beforeUpdate: (testParticipant, options) => {
        testParticipant.updatedAt = Date.now();
      },
    },
  }
);

module.exports = TestParticipant;
