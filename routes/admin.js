const express = require("express");
const router = express.Router();
var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");

const { Admin } = require("../models/admin");

const { sequelize, secret, logger } = require("../scripts/config");
const ACTIVE = 1;
// const moment = require("moment");

// login a super admin
router.post("/login", async (req, res) => {
  // sequelize.sync().then(
  //   () =>
  await Admin.findOne({
    where: { name: req.body.name },
  })
    .then((admin) => {
      if (admin && bcrypt.compareSync(req.body.password, admin["password"])) {
        // create a token
        var token = jwt.sign({ sub: admin["name"] }, secret, {
          expiresIn: 6000, // expires in an hour
        });
        logger.info(
          "[INFO]: 200 - " +
            req.body.email +
            " successfully logged in - " +
            req.originalUrl +
            " - " +
            req.method +
            " - " +
            req.ip
        );
        return res.json({
          status: "success",
          token: token,
          admin: {
            _uid: admin["id"],
            _name: admin["name"],
            _phoneNumber: admin["phoneNumber"],
            _dob: admin["dob"],
            _gender: admin["gender"],
            _super: admin["super"],
            _user: admin["user"],
          },
        });
        //   })
        //   .catch((e) => {
        //     logger.error(
        //       `[ERROR]: ${e.status || 500} - ${e.message} - ${
        //         req.originalUrl
        //       } - ${req.method} - ${req.ip}`
        //     );
        //   });
      } else
        res
          .status(500)
          .send({ status: "failed", message: "failed to authenticate admin" });
    })
    .catch((e) => {
      logger.error(
        `[ERROR]: ${e.status || 500} - ${e.message} - ${req.originalUrl} - ${
          req.method
        } - ${req.ip}`
      );
    });
  // );
});

module.exports = router;
