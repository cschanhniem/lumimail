"use client";

import { useEffect } from "react";
import { authFetch } from "@/lib/auth/client";

export function MarkAsRead({ messageId }: { messageId: string }) {
	useEffect(() => {
		authFetch(`/api/messages/${messageId}/read`, { method: "POST" })
			.then((response) => {
				if (response.ok) window.dispatchEvent(new Event("lumimail:messages-changed"));
			})
			.catch(() => {
				if (process.env.NODE_ENV !== "production") {
					console.error("Failed to mark message as read:", messageId);
				}
			});
	}, [messageId]);

	return null;
}
