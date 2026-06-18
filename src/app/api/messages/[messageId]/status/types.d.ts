export type MessageStatus = "received" | "sent" | "draft" | "spam" | "trash" | "queued" | "failed";

export type MessageStatusPayload = {
	status?: MessageStatus;
};
