import { useEffect, useState } from "react";
import type { MessageCounts } from "./types";
import { clearMessageCountsCache, fetchMessageCounts } from "./utils";

const emptyCounts: MessageCounts = {
	folders: {
		inbox: { total: 0, unread: 0 },
		sent: { total: 0, unread: 0 },
		drafts: { total: 0, unread: 0 },
		spam: { total: 0, unread: 0 },
		trash: { total: 0, unread: 0 },
		starred: { total: 0, unread: 0 },
	},
	mailboxes: [],
};

export function useMessageCounts(mailboxId?: string | null, enabled = true) {
	const [counts, setCounts] = useState<MessageCounts>(emptyCounts);
	const [isLoading, setIsLoading] = useState(enabled);

	useEffect(() => {
		if (!enabled) {
			setIsLoading(false);
			return;
		}

		let cancelled = false;

		async function loadCounts(force = false) {
			setIsLoading(true);
			try {
				const nextCounts = await fetchMessageCounts(mailboxId, force);
				if (!cancelled) setCounts(nextCounts ?? emptyCounts);
			} catch (err) {
				if (!cancelled) setCounts(emptyCounts);
				if (process.env.NODE_ENV !== "production") {
					console.error("Failed to load message counts", err);
				}
			} finally {
				if (!cancelled) setIsLoading(false);
			}
		}

		void loadCounts();
		function onMessagesChanged() {
			clearMessageCountsCache();
			void loadCounts(true);
		}
		window.addEventListener("lumimail:messages-changed", onMessagesChanged);

		return () => {
			cancelled = true;
			window.removeEventListener("lumimail:messages-changed", onMessagesChanged);
		};
	}, [enabled, mailboxId]);

	return { counts, isLoading };
}
