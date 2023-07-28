const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const cors = require("cors");
// Set up middleware to parse JSON data
app.use(bodyParser.json());
// enable cross-origin resource sharing
app.use(cors());

require("dotenv").config();
const PORT = process.env.PORT;

const contactsRouter = require("./routes/contacts");
const adminRouter = require("./routes/admin");
const messagesRouter = require("./routes/messages");

// Mount the contactsRouter to handle the /sendBulkSMS endpoint
app.use("/api", contactsRouter);
app.use("/api/admin", adminRouter);
app.use("/api/messages", messagesRouter);

app.listen(PORT, () => {
  console.log(`Server is listenning on port ${PORT}`);
});

module.exports = app;
