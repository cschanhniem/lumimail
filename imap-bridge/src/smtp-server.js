/* eslint-disable */
"use strict";

const { SMTPServer } = require("smtp-server");
const { simpleParser } = require("mailparser");
const { authenticate, sendMessage } = require("./api-client");

const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587");
const TLS_KEY = process.env.TLS_KEY_PATH;
const TLS_CERT = process.env.TLS_CERT_PATH;

const sessions = new Map();

function createSmtpServer() {
  const opts = {
    secure: false,
    starttls: true,
    authOptional: false,

    onAuth(auth, session, callback) {
      authenticate(auth.username, auth.password)
        .then((result) => {
          if (!result) return callback(new Error("Invalid credentials"));
          sessions.set(session.id, result);
          callback(null, { user: result.user });
        })
        .catch(() => callback(new Error("Auth error")));
    },

    onData(stream, session, callback) {
      const creds = sessions.get(session.id);
      if (!creds) return callback(new Error("Not authenticated"));

      const chunks = [];
      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("end", async () => {
        try {
          const raw = Buffer.concat(chunks);
          const parsed = await simpleParser(raw);

          const to = [].concat(parsed.to?.value ?? []).map((a) => a.address).filter(Boolean);
          const from = parsed.from?.value?.[0]?.address;
          const subject = parsed.subject ?? "";
          const text = parsed.text ?? "";
          const html = parsed.html || undefined;

          await sendMessage(creds.apiKey, { from, to, subject, text, html });
          callback();
        } catch (err) {
          callback(new Error("Send failed: " + err.message));
        }
      });
    },

    onClose(session) {
      sessions.delete(session.id);
    },

    disabledCommands: TLS_KEY && TLS_CERT ? [] : ["STARTTLS"],
  };

  if (TLS_KEY && TLS_CERT) {
    const fs = require("fs");
    opts.key = fs.readFileSync(TLS_KEY);
    opts.cert = fs.readFileSync(TLS_CERT);
  }

  const server = new SMTPServer(opts);

  server.on("error", (err) => {
    console.error("SMTP error:", err.message);
  });

  return server;
}

function startSmtpServer() {
  const server = createSmtpServer();
  server.listen(SMTP_PORT, () => {
    console.log(`SMTP bridge listening on port ${SMTP_PORT}`);
  });
  return server;
}

module.exports = { startSmtpServer };
