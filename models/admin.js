const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../scripts/config");

class Admin extends Model {}
Admin.init(
  {
    user: DataTypes.STRING,
    name: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    password: DataTypes.STRING,
    super: DataTypes.INTEGER,
    gender: DataTypes.STRING,

    createdBy: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedBy: DataTypes.STRING,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, modelName: "admin", freezeTableName: true }
);

Admin.sync({ alter: true })
  .then(() => {
    console.log("Admin table created successfully");
  })
  .catch((error) => {
    console.log(`Error creating Admin: ${error}`);
  });
module.exports = { Admin };
