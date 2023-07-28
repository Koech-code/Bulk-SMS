// PREPARE THE CHAIN, DOES FIRST ISSUE TO FIRST SUPERADMIN
var bcrypt = require("bcrypt");
const { sequelize, logger } = require("./config");

const { Admin } = require("../models/admin");

var data = {
  name: "Symogas",
  phoneNumber: process.env.PHONENUMBER,
  password: bcrypt.hashSync(process.env.PASSWORD, 8),
  gender: "system",
  super: 1,
  user: "Admin",
  createdBy: "system",
  createdAt: Date.now(),
};

sequelize.sync().then(() =>
  Admin.findOne({
    attributes: ["name"],
    where: { name: data.name },
  }).then((admin) => {
    if (admin) logger.info("[INFO] SYETEM PREP HAS ALREADY BEEN EXECUTED.");
    else {
      logger.info(
        "[INFO] ---------------------- RUNNING SYSTEM PREP ----------------------"
      );

      Admin.create(data)
        .then((response) => {
          logger.info(
            "[INFO] - FINISHED SUCCESSFULLY, SYSTEM ADMIN CREATED!!!"
          );
        })
        .catch((err) => {
          logger.error("[ERROR] - " + err);
        });
    }
  })
);
