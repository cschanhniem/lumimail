/* eslint-disable */
"use strict";

/**
 * Minimal IMAP4rev1 server implementation.
 * Bridges to the Lumimail HTTP API.
 *
 * Supports: LOGIN, LIST, SELECT, FETCH, STORE, EXPUNGE, LOGOUT, NOOP, CAPABILITY
 */

const net = require("net");
const tls = require("tls");
const fs = require("fs");
const { authenticate, listMessages, getMessage, markRead, moveToTrash } = require("./api-client");

const IMAP_PORT = parseInt(process.env.IMAP_PORT || "143");
const IMAPS_PORT = parseInt(process.env.IMAPS_PORT || "993");
const TLS_KEY = process.env.TLS_KEY_PATH;
const TLS_CERT = process.env.TLS_CERT_PATH;

const FOLDERS = ["INBOX", "Sent", "Drafts", "Spam", "Trash", "Starred"];

const CAPABILITIES = "IMAP4rev1 LITERAL+ SASL-IR LOGIN-REFERRALS ID ENABLE IDLE NAMESPACE STARTTLS AUTH=PLAIN AUTH=LOGIN";

class ImapSession {
  constructor(socket) {
    this.socket = socket;
    this.state = "not_authenticated";
    this.creds = null;
    this.selectedFolder = null;
    this.messageCache = [];
    this.buffer = "";

    socket.on("data", (data) => {
      this.buffer += data.toString();
      const lines = this.buffer.split("\r\n");
      this.buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (line.trim()) this.handleLine(line).catch((e) => this.sendUntagged("BAD " + e.message));
      }
    });

    socket.on("error", () => {});
    socket.on("close", () => {});

    this.send("* OK Lumimail IMAP bridge ready");
  }

  send(line) {
    try {
      this.socket.write(line + "\r\n");
    } catch {}
  }

  sendUntagged(line) {
    this.send(`* ${line}`);
  }

  async handleLine(line) {
    const spaceIdx = line.indexOf(" ");
    if (spaceIdx === -1) return;
    const tag = line.substring(0, spaceIdx);
    const rest = line.substring(spaceIdx + 1).trim();

    const cmdSpaceIdx = rest.indexOf(" ");
    const cmd = (cmdSpaceIdx === -1 ? rest : rest.substring(0, cmdSpaceIdx)).toUpperCase();
    const args = cmdSpaceIdx === -1 ? "" : rest.substring(cmdSpaceIdx + 1);

    switch (cmd) {
      case "CAPABILITY":
        this.sendUntagged(`CAPABILITY ${CAPABILITIES}`);
        this.send(`${tag} OK CAPABILITY completed`);
        break;

      case "NOOP":
        this.send(`${tag} OK NOOP completed`);
        break;

      case "LOGOUT":
        this.sendUntagged("BYE Lumimail IMAP bridge signing off");
        this.send(`${tag} OK LOGOUT completed`);
        this.socket.end();
        break;

      case "LOGIN": {
        const parts = args.match(/^"?([^" ]+)"? "?([^"]+)"?$/);
        if (!parts) { this.send(`${tag} BAD Invalid LOGIN args`); break; }
        const [, username, password] = parts;
        const result = await authenticate(username, password);
        if (!result) { this.send(`${tag} NO Invalid credentials`); break; }
        this.creds = result;
        this.state = "authenticated";
        this.send(`${tag} OK LOGIN completed`);
        break;
      }

      case "LIST": {
        if (this.state !== "authenticated" && this.state !== "selected") {
          this.send(`${tag} NO Not authenticated`); break;
        }
        for (const folder of FOLDERS) {
          this.sendUntagged(`LIST (\\HasNoChildren) "/" "${folder}"`);
        }
        this.send(`${tag} OK LIST completed`);
        break;
      }

      case "LSUB": {
        if (this.state !== "authenticated" && this.state !== "selected") {
          this.send(`${tag} NO Not authenticated`); break;
        }
        for (const folder of FOLDERS) {
          this.sendUntagged(`LSUB (\\HasNoChildren) "/" "${folder}"`);
        }
        this.send(`${tag} OK LSUB completed`);
        break;
      }

      case "SELECT":
      case "EXAMINE": {
        if (this.state !== "authenticated" && this.state !== "selected") {
          this.send(`${tag} NO Not authenticated`); break;
        }
        const folder = args.replace(/^"|"$/g, "");
        if (!FOLDERS.includes(folder)) { this.send(`${tag} NO No such mailbox`); break; }
        this.selectedFolder = folder;
        this.messageCache = await listMessages(this.creds.apiKey, folder, { limit: 100 });
        this.state = "selected";
        this.sendUntagged(`${this.messageCache.length} EXISTS`);
        this.sendUntagged("0 RECENT");
        this.sendUntagged(`FLAGS (\\Seen \\Answered \\Flagged \\Deleted \\Draft)`);
        this.sendUntagged(`OK [PERMANENTFLAGS (\\Seen \\Flagged \\Deleted \\* )] Permanent flags`);
        this.sendUntagged(`OK [UIDVALIDITY 1] UIDs valid`);
        this.sendUntagged(`OK [UIDNEXT ${this.messageCache.length + 1}] Predicted next UID`);
        this.send(`${tag} OK ${cmd === "SELECT" ? "[READ-WRITE]" : "[READ-ONLY]"} ${folder} selected`);
        break;
      }

      case "FETCH": {
        if (this.state !== "selected") { this.send(`${tag} NO Not in selected state`); break; }
        const [seqSet, ...itemParts] = args.split(" ");
        const items = itemParts.join(" ");
        const indices = this.parseSequenceSet(seqSet);

        for (const idx of indices) {
          const msg = this.messageCache[idx - 1];
          if (!msg) continue;

          const uid = idx;
          const flags = msg.read ? "\\Seen" : "";
          const date = new Date(msg.createdAt).toUTCString().replace(/GMT$/, "+0000");

          if (items.includes("BODY") || items.includes("RFC822")) {
            const detail = await getMessage(this.creds.apiKey, msg.id);
            const rawBody = this.buildRawEmail(msg, detail);
            this.sendUntagged(`${idx} FETCH (UID ${uid} FLAGS (${flags}) INTERNALDATE "${date}" RFC822.SIZE ${rawBody.length} BODY[] {${rawBody.length}}`);
            this.socket.write(`\r\n${rawBody}\r\n)\r\n`);
          } else {
            const envelope = `("${date}" "${msg.subject ?? ""}" (("" NIL "${msg.fromAddr}" "")) (("" NIL "${msg.fromAddr}" "")) (("" NIL "${msg.fromAddr}" "")) (("" NIL "${msg.toAddr}" "")) NIL NIL NIL "<${msg.id}>")`;
            this.sendUntagged(`${idx} FETCH (UID ${uid} FLAGS (${flags}) ENVELOPE ${envelope})`);
          }
        }
        this.send(`${tag} OK FETCH completed`);
        break;
      }

      case "STORE": {
        if (this.state !== "selected") { this.send(`${tag} NO Not in selected state`); break; }
        const [seqSet, flagOp, ...flagParts] = args.split(" ");
        const flagStr = flagParts.join(" ");
        const indices = this.parseSequenceSet(seqSet);

        for (const idx of indices) {
          const msg = this.messageCache[idx - 1];
          if (!msg) continue;
          if (flagStr.includes("\\Seen")) {
            const read = flagOp.startsWith("+") || flagOp === "FLAGS";
            await markRead(this.creds.apiKey, msg.id, read);
            msg.read = read;
          }
          if (flagStr.includes("\\Deleted")) {
            await moveToTrash(this.creds.apiKey, msg.id);
          }
          const flags = msg.read ? "\\Seen" : "";
          if (!flagOp.endsWith(".SILENT")) {
            this.sendUntagged(`${idx} FETCH (FLAGS (${flags}))`);
          }
        }
        this.send(`${tag} OK STORE completed`);
        break;
      }

      case "EXPUNGE":
        this.send(`${tag} OK EXPUNGE completed`);
        break;

      case "CLOSE":
        this.selectedFolder = null;
        this.state = "authenticated";
        this.send(`${tag} OK CLOSE completed`);
        break;

      case "STATUS": {
        if (this.state !== "authenticated" && this.state !== "selected") {
          this.send(`${tag} NO Not authenticated`); break;
        }
        const [statusFolder] = args.split(" ");
        const folderName = statusFolder.replace(/^"|"$/g, "");
        const msgs = await listMessages(this.creds.apiKey, folderName, { limit: 100 });
        const unseen = msgs.filter((m) => !m.read).length;
        this.sendUntagged(`STATUS "${folderName}" (MESSAGES ${msgs.length} UNSEEN ${unseen} RECENT 0)`);
        this.send(`${tag} OK STATUS completed`);
        break;
      }

      case "SEARCH": {
        if (this.state !== "selected") { this.send(`${tag} NO Not in selected state`); break; }
        const indices = this.messageCache.map((_, i) => i + 1).join(" ");
        this.sendUntagged(`SEARCH ${indices}`);
        this.send(`${tag} OK SEARCH completed`);
        break;
      }

      case "NAMESPACE":
        this.sendUntagged(`NAMESPACE (("" "/")) NIL NIL`);
        this.send(`${tag} OK NAMESPACE completed`);
        break;

      default:
        this.send(`${tag} BAD Unknown command ${cmd}`);
    }
  }

  parseSequenceSet(seqSet) {
    const total = this.messageCache.length;
    const indices = new Set();
    for (const part of seqSet.split(",")) {
      if (part === "*") {
        indices.add(total);
      } else if (part.includes(":")) {
        let [start, end] = part.split(":").map((s) => s === "*" ? total : parseInt(s));
        if (start > end) [start, end] = [end, start];
        for (let i = start; i <= Math.min(end, total); i++) indices.add(i);
      } else {
        const n = parseInt(part);
        if (n >= 1 && n <= total) indices.add(n);
      }
    }
    return [...indices].sort((a, b) => a - b);
  }

  buildRawEmail(msg, detail) {
    const date = new Date(msg.createdAt).toUTCString();
    const body = detail?.textBody || msg.snippet || "";
    const htmlBody = detail?.htmlBody;

    let raw = `From: ${msg.fromAddr}\r\n`;
    raw += `To: ${msg.toAddr}\r\n`;
    raw += `Subject: ${msg.subject ?? "(no subject)"}\r\n`;
    raw += `Date: ${date}\r\n`;
    raw += `Message-ID: <${msg.id}@lumimail>\r\n`;

    if (htmlBody) {
      const boundary = `lumimail_${msg.id}`;
      raw += `Content-Type: multipart/alternative; boundary="${boundary}"\r\n\r\n`;
      raw += `--${boundary}\r\nContent-Type: text/plain; charset=utf-8\r\n\r\n${body}\r\n`;
      raw += `--${boundary}\r\nContent-Type: text/html; charset=utf-8\r\n\r\n${htmlBody}\r\n`;
      raw += `--${boundary}--\r\n`;
    } else {
      raw += `Content-Type: text/plain; charset=utf-8\r\n\r\n${body}\r\n`;
    }

    return raw;
  }
}

function startImapServer() {
  const server = net.createServer((socket) => {
    new ImapSession(socket);
  });

  server.listen(IMAP_PORT, () => {
    console.log(`IMAP bridge listening on port ${IMAP_PORT}`);
  });

  if (TLS_KEY && TLS_CERT) {
    const tlsServer = tls.createServer({
      key: fs.readFileSync(TLS_KEY),
      cert: fs.readFileSync(TLS_CERT),
    }, (socket) => {
      new ImapSession(socket);
    });

    tlsServer.listen(IMAPS_PORT, () => {
      console.log(`IMAPS bridge listening on port ${IMAPS_PORT}`);
    });
  }

  return server;
}

module.exports = { startImapServer };
