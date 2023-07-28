const express = require("express");
const router = express.Router();
const { Admin } = require("../models/admin");
const { Messages } = require("../models/messages");
const { Contacts } = require("../models/contacts");
var token_verifier = require("../scripts/verify-token");
const { logger } = require("../scripts/config");
const Africastalking = require("africastalking");

const username = "sandbox";
const apiKey =
  "a85435d38da899d8fb5c2b03ad08d837168476c01ee7384dd1da165204cd7db2";

const africastalking = Africastalking({ apiKey, username });

// Create a function to send bulk SMS
const sendBulkSMS = (recipients, message) => {
  const sms = africastalking.SMS;
  const phoneNumbers = Array.isArray(recipients) ? recipients : [recipients]; // Ensure recipients is an array

  sms
    .send({ to: phoneNumbers, message, from: "SymoGas" })
    .then((response) => {
      console.log("SMS sent successfully:", response);

      // Log recipients
      if (response.SMSMessageData && response.SMSMessageData.Recipients) {
        console.log("Recipients:", response.SMSMessageData.Recipients);
      }
    })
    .catch((error) => {
      console.error("Error sending SMS:", error);
    });
};

router.post("/compose", token_verifier, async (req, res) => {
  try {
    const admin = await Admin.findOne({
      attributes: ["name"],
      where: { name: req.verifiedUser.sub }, // Assuming 'createdBy' field contains the admin name
    });

    if (!admin) {
      return res.status(500).json({
        status: "failed",
        message: "Failed to authenticate admin",
      });
    }

    req.body.updatedBy = req.verifiedUser.sub;

    req.body.createdBy = req.verifiedUser.sub;

    const composedMessage = await Messages.create(req.body);

    // Fetch recipients from the Contacts model
    const recipients = await Contacts.findAll({
      attributes: ["phoneNumber"],
    });

    if (!recipients || recipients.length === 0) {
      return res.status(404).json({
        status: "failed",
        message: "No recipients found",
      });
    }

    // Extract phone numbers from the recipients array
    const phoneNumbers = recipients.map((contact) => contact.phoneNumber);

    // Send the composed message to each recipient
    for (const phoneNumber of phoneNumbers) {
      try {
        await sendBulkSMS(phoneNumber, req.body.message);
      } catch (error) {
        // You can handle the error here, e.g., log it or do something else
        console.error(`Failed to send message to ${phoneNumber}`);
      }
    }

    console.log(
      `[INFO]: ${req.body.message} Message composed successfully and sent to recipients`
    );

    res.status(200).json({
      status: "success",
      message: "Message composed and sent successfully to recipients",
      response: composedMessage,
    });
  } catch (error) {
    console.error(`[ERROR]: ${error.status || 500} - ${error.message}`);
    res.status(500).json({
      status: "failed",
      message: "An error occurred while composing the message",
    });
  }
});

// POST endpoint for sending bulk SMS
router.get("/all", async (req, res) => {
  try {
    const messages = await Messages.findAll({});
    res.status(200).json({ success: "success", messages: messages });
  } catch (error) {
    res.status(500).json({ message: "Failed to get messages." });
  }
});
module.exports = router;
