import type { InboundQueueMessage } from "./src/lib/email/inbound";

export function isInboundQueueMessage(payload: unknown): payload is InboundQueueMessage {
	return (
		typeof payload === "object" &&
		payload !== null &&
		"rawR2Key" in payload &&
		"from" in payload &&
		"to" in payload
	);
}

export interface OutboundQueueMessage {
	messageId: string;
	from: string;
	to: string;
}

export function isOutboundQueueMessage(payload: unknown): payload is OutboundQueueMessage {
	return (
		typeof payload === "object" &&
		payload !== null &&
		"messageId" in payload &&
		"from" in payload &&
		"to" in payload
	);
}
