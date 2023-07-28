const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../scripts/config");

class Messages extends Model {}
Messages.init(
  {
    message: DataTypes.STRING,

    createdBy: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedBy: DataTypes.STRING,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, modelName: "Messages", freezeTableName: true }
);

Messages.sync({ alter: true })
  .then(() => {
    console.log("Messages table created successfully");
  })
  .catch((error) => {
    console.log(`Error creating Messages: ${error}`);
  });
module.exports = { Messages };
