const express = require("express");
const router = express.Router();
const { Admin } = require("../models/admin");
const { Contacts } = require("../models/contacts");
var token_verifier = require("../scripts/verify-token");
const { logger } = require("../scripts/config");

// POST endpoint for sending bulk SMS
router.get("/customers", async (req, res) => {
  try {
    const contacts = await Contacts.findAll({});
    res.status(200).json({ success: "success", contacts: contacts });
  } catch (error) {
    res.status(500).json({ message: "Failed to get contacts." });
  }
});
router.post("/admit/contact", token_verifier, async (req, res) => {
  try {
    const admin = await Admin.findOne({
      attributes: ["name"],
      where: { name: req.verifiedUser.sub },
    });

    if (!admin) {
      return res.status(500).json({
        status: "failed",
        message: "Failed to authenticate admin",
      });
    }

    Contacts.findOne({
      attributes: ["phoneNumber"],
      where: {
        phoneNumber: req.body.phoneNumber,
      },
    }).then((contact) => {
      if (contact) {
        return res.status(500).send({
          status: "failed",
          message: "Contact is already registered",
        });
      }

      // Proceed with creating the contact if it doesn't exist

      req.body.updatedBy = req.verifiedUser.sub;

      req.body.createdBy = req.verifiedUser.sub;
      Contacts.create(req.body).then((createdContact) => {
        if (!createdContact) {
          return res.status(500).json({
            status: "failed",
            message: "Failed to admit contact",
          });
        }

        logger.info(
          `Contact admitted successfully: ${createdContact.phoneNumber}`
        );

        res.status(200).json({
          status: "success",
          message: "Contact admitted successfully",
          response: createdContact,
        });
      });
    });
  } catch (error) {
    logger.error(
      `[ERROR]: ${error.status || 500} - ${error.message} - ${
        req.originalUrl
      } - ${req.method} - ${req.ip}`
    );

    res.status(500).json({
      status: "failed",
      message: "An error occurred while admitting the contact",
    });
  }
});

module.exports = router;
