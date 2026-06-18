"use client";

import { useState } from "react";
import { Plus, Users, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authFetch } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";

type ContactSource = "manual" | "inbound" | "outbound";

type Contact = {
	id: string;
	email: string;
	displayName: string | null;
	source: ContactSource;
	lastSeenAt: string | null;
	createdAt: string;
};

const SOURCE_BADGE: Record<ContactSource, { label: string; className: string }> = {
	manual: { label: "Manual", className: "bg-blue-100 text-blue-700" },
	inbound: { label: "Inbound", className: "bg-green-100 text-green-700" },
	outbound: { label: "Outbound", className: "bg-purple-100 text-purple-700" },
};

function getInitial(contact: Contact): string {
	const name = contact.displayName ?? contact.email;
	return name.charAt(0).toUpperCase();
}

function formatDate(value: string | null): string {
	if (!value) return "—";
	return new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

async function fetchContacts(): Promise<Contact[]> {
	const res = await authFetch("/api/contacts");
	const json = (await res.json()) as { success: boolean; data?: Contact[] };
	return json.data ?? [];
}

export default function ContactsPage() {
	const queryClient = useQueryClient();
	const [search, setSearch] = useState("");
	const [showForm, setShowForm] = useState(false);
	const [email, setEmail] = useState("");
	const [displayName, setDisplayName] = useState("");
	const [formError, setFormError] = useState<string | null>(null);

	const { data: contacts = [], isLoading } = useQuery({
		queryKey: ["contacts"],
		queryFn: fetchContacts,
	});

	const createMutation = useMutation({
		mutationFn: async () => {
			const res = await authFetch("/api/contacts", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: email.trim(), displayName: displayName.trim() || undefined }),
			});
			const json = (await res.json()) as { success: boolean; error?: { message: string } };
			if (!res.ok) throw new Error(json.error?.message ?? "Failed to create contact");
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["contacts"] });
			setEmail("");
			setDisplayName("");
			setFormError(null);
			setShowForm(false);
		},
		onError: (err: Error) => {
			setFormError(err.message);
		},
	});

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!email.trim()) {
			setFormError("Email is required");
			return;
		}
		createMutation.mutate();
	}

	const filtered = contacts.filter((c) => {
		const q = search.toLowerCase();
		return c.email.toLowerCase().includes(q) || (c.displayName ?? "").toLowerCase().includes(q);
	});

	return (
		<div className="space-y-6 p-6">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-xl font-semibold text-neutral-900">Contacts</h2>
					<p className="text-sm text-neutral-500">People you have emailed or received mail from.</p>
				</div>
				<Button onClick={() => setShowForm((v) => !v)} className="gap-2">
					<Plus className="h-4 w-4" />
					Add contact
				</Button>
			</div>

			{showForm && (
				<form
					onSubmit={handleSubmit}
					className="rounded-lg border border-neutral-200 bg-white p-4 space-y-3"
				>
					<div className="flex items-center justify-between">
						<h3 className="text-sm font-medium text-neutral-700">New contact</h3>
						<button
							type="button"
							onClick={() => { setShowForm(false); setFormError(null); }}
							className="text-neutral-400 hover:text-neutral-600"
						>
							<X className="h-4 w-4" />
						</button>
					</div>

					{formError && (
						<p className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
							{formError}
						</p>
					)}

					<div className="flex items-center gap-3">
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Email address"
							required
							className="h-9 flex-1 rounded-md border border-neutral-200 bg-neutral-50 px-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-300"
						/>
						<input
							type="text"
							value={displayName}
							onChange={(e) => setDisplayName(e.target.value)}
							placeholder="Display name (optional)"
							className="h-9 flex-1 rounded-md border border-neutral-200 bg-neutral-50 px-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-300"
						/>
						<Button type="submit" disabled={createMutation.isPending}>
							{createMutation.isPending ? "Adding…" : "Add"}
						</Button>
					</div>
				</form>
			)}

			<div>
				<input
					type="search"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder="Search contacts…"
					className="h-9 w-full max-w-sm rounded-md border border-neutral-200 bg-neutral-50 px-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-300"
				/>
			</div>

			{isLoading ? (
				<p className="text-sm text-neutral-500">Loading…</p>
			) : filtered.length === 0 ? (
				<div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-neutral-200 py-12 text-center">
					<Users className="mb-3 h-8 w-8 text-neutral-300" />
					<p className="text-sm text-neutral-500">
						{search ? "No contacts match your search." : "No contacts yet. They appear automatically when you send or receive email."}
					</p>
				</div>
			) : (
				<div className="divide-y divide-neutral-100 rounded-lg border border-neutral-200 bg-white">
					{filtered.map((contact) => {
						const badge = SOURCE_BADGE[contact.source] ?? SOURCE_BADGE.manual;
						return (
							<div
								key={contact.id}
								className="flex items-center gap-4 px-4 py-3"
							>
								<div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-neutral-100 text-sm font-semibold text-neutral-700">
									{getInitial(contact)}
								</div>
								<div className="flex-1 min-w-0">
									{contact.displayName && (
										<p className="text-sm font-medium text-neutral-900 truncate">{contact.displayName}</p>
									)}
									<p className="text-sm text-neutral-500 truncate">{contact.email}</p>
								</div>
								<span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${badge.className}`}>
									{badge.label}
								</span>
								<span className="shrink-0 text-xs text-neutral-400 tabular-nums">
									{formatDate(contact.lastSeenAt)}
								</span>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
