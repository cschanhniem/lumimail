import { useEffect, useState } from "react";
import type { Message, MessageFilterOptions, MessageFolder } from "./types";
import { clearMessageCountsCache, clearMessageListCache, fetchMessageList, getMessageQueryParams } from "./utils";

export function useMessages(
	folder: MessageFolder,
	mailboxId?: string | null,
	filters?: MessageFilterOptions,
	enabled = true,
) {
	const [messages, setMessages] = useState<Message[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [total, setTotal] = useState(0);
	const [limit, setLimit] = useState(filters?.limit ?? 25);
	const [offset, setOffset] = useState(filters?.offset ?? 0);

	const unreadCount = messages.filter((m) => m.direction === "inbound" && !m.read).length;

	useEffect(() => {
		if (!enabled) return;
		let cancelled = false;
		async function loadMessages(force = false) {
			setIsLoading(true);
			try {
				const params = getMessageQueryParams(folder, mailboxId, filters);
				const data = await fetchMessageList(params, force);
				if (!cancelled) {
					setMessages(data.messages ?? []);
					setTotal(data.total ?? 0);
					setLimit(data.limit ?? filters?.limit ?? 25);
					setOffset(data.offset ?? filters?.offset ?? 0);
				}
			} catch (err) {
				if (!cancelled) {
					setMessages([]);
					setTotal(0);
					if (process.env.NODE_ENV !== "production") {
						console.error("Failed to load messages", err);
					}
				}
			} finally {
				if (!cancelled) setIsLoading(false);
			}
		}

		void loadMessages();
		function onMessagesChanged() {
			clearMessageListCache();
			clearMessageCountsCache();
			void loadMessages(true);
		}
		window.addEventListener("lumimail:messages-changed", onMessagesChanged);

		return () => {
			cancelled = true;
			window.removeEventListener("lumimail:messages-changed", onMessagesChanged);
		};
	}, [enabled, filters?.labelId, filters?.limit, filters?.offset, filters?.query, filters?.read, filters?.title, folder, mailboxId]);

	return { messages, setMessages, unreadCount, isLoading, total, limit, offset };
}
