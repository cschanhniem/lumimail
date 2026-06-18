import { FileText, Inbox, MailCheck, Send, ShieldAlert, Trash2 } from "lucide-react";
import type { HomeAction, MailPreview, SidebarItem } from "./types";

export const sidebarItems: SidebarItem[] = [
	{ label: "Inbox", icon: Inbox, active: true, count: "18" },
	{ label: "Sent", icon: Send },
	{ label: "Drafts", icon: FileText, count: "4" },
	{ label: "Spam", icon: ShieldAlert },
	{ label: "Trash", icon: Trash2 },
];

export const heroMessages: MailPreview[] = [
	{
		icon: MailCheck,
		sender: "postmaster@northline.dev",
		subject: "Route matched",
		preview: "Inbound mail was delivered to support after DNS validation.",
		badge: "Inbound",
	},
	{
		icon: MailCheck,
		sender: "ops@halcyon.tools",
		subject: "API send accepted",
		preview: "Message queued through the production API key.",
		badge: "Sent",
	},
	{
		icon: MailCheck,
		sender: "alerts@marketmesh.io",
		subject: "Webhook delivered",
		preview: "Event payload reached your billing workspace endpoint.",
		badge: "Hook",
	},
	{
		icon: MailCheck,
		sender: "admin@lumimail.dev",
		subject: "Mailbox provisioned",
		preview: "New routing mailbox is ready for customer replies.",
		badge: "Admin",
	},
];

export function getHomeActions(isLoggedIn: boolean): HomeAction[] {
	if (isLoggedIn) {
		return [{ href: "/inbox", label: "Dashboard", variant: "default" }];
	}

	return [
		{ href: "/login", label: "Log in", variant: "outline" },
		{ href: "/register", label: "Create account", variant: "default" },
	];
}
