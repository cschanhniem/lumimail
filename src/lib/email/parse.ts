import PostalMime from "postal-mime";
import DOMPurify from "isomorphic-dompurify";
import { formatPostalAddress, formatPostalAddressList } from "@/lib/email/address";
import { getLatestEmailContent, htmlToReadableText } from "@/lib/email/reply-content-utils";

export type ParsedEmail = {
	subject: string | null;
	text: string | null;
	html: string | null;
	messageId: string | null;
	fromAddr: string | null;
	toAddr: string | null;
};

function sanitizeHtml(html: string | null | undefined): string | null {
	if (!html) return null;
	return DOMPurify.sanitize(html);
}

export async function parseRawMime(raw: ArrayBuffer): Promise<ParsedEmail> {
	const email = await PostalMime.parse(raw);
	return {
		subject: email.subject ?? null,
		text: email.text ?? null,
		html: sanitizeHtml(email.html),
		messageId: email.messageId ?? null,
		fromAddr: formatPostalAddress(email.from, null),
		toAddr: formatPostalAddressList(email.to, null),
	};
}

export function buildSnippet(text: string | null, html: string | null, max = 200): string {
	const source = getLatestEmailContent(text ?? htmlToReadableText(html));
	return source.replace(/\s+/g, " ").trim().slice(0, max);
}
