/* eslint-disable */
"use strict";

require("dotenv").config();

const { startImapServer } = require("./imap-server");
const { startSmtpServer } = require("./smtp-server");

console.log("Starting Lumimail IMAP/SMTP bridge...");
console.log(`API URL: ${process.env.LUMIMAIL_API_URL || "https://mail.yourdomain.com"}`);

startImapServer();
startSmtpServer();
