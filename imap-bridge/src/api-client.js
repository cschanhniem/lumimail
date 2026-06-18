/* eslint-disable */
"use strict";

const LUMIMAIL_API_URL = process.env.LUMIMAIL_API_URL || "https://mail.yourdomain.com";

async function apiRequest(path, options = {}, apiKey) {
  const url = `${LUMIMAIL_API_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  return res;
}

async function authenticate(username, password) {
  const res = await apiRequest("/api/auth/me", {}, password);
  if (!res.ok) return null;
  const json = await res.json();
  const user = json.data?.user ?? json.user;
  if (!user) return null;
  if (user.email !== username) return null;
  return { user, apiKey: password };
}

async function listMessages(apiKey, folder, { limit = 50, offset = 0 } = {}) {
  const params = new URLSearchParams({ limit, offset });

  switch (folder) {
    case "INBOX":
      params.set("direction", "inbound");
      params.set("status", "received");
      break;
    case "Sent":
      params.set("direction", "outbound");
      params.set("status", "sent");
      break;
    case "Drafts":
      params.set("direction", "outbound");
      params.set("status", "draft");
      break;
    case "Spam":
    case "Junk":
      params.set("status", "spam");
      break;
    case "Trash":
      params.set("status", "trash");
      break;
    case "Starred":
      params.set("starred", "true");
      break;
  }

  const res = await apiRequest(`/api/messages?${params}`, {}, apiKey);
  if (!res.ok) return [];
  const json = await res.json();
  return json.messages ?? [];
}

async function getMessage(apiKey, messageId) {
  const res = await apiRequest(`/api/messages/${messageId}`, {}, apiKey);
  if (!res.ok) return null;
  const json = await res.json();
  return json.data?.message ?? json.message ?? null;
}

async function sendMessage(apiKey, { from, to, subject, text, html, mailboxId }) {
  const res = await apiRequest("/api/v1/send", {
    method: "POST",
    body: JSON.stringify({ from, to, subject, text, html, mailboxId }),
  }, apiKey);
  return res.ok;
}

async function markRead(apiKey, messageId, read) {
  await apiRequest(`/api/messages/${messageId}/read`, {
    method: "PATCH",
    body: JSON.stringify({ read }),
  }, apiKey);
}

async function moveToTrash(apiKey, messageId) {
  await apiRequest(`/api/messages/${messageId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status: "trash" }),
  }, apiKey);
}

module.exports = { authenticate, listMessages, getMessage, sendMessage, markRead, moveToTrash };
