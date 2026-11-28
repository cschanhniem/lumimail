import type { Metadata } from "next";
import { LegalDocumentView } from "@/components/legal/legal-document-view";
import { termsOfService } from "@/lib/legal/legal-content";

export const metadata: Metadata = {
	title: "Terms of Service — Lumimail",
	description: termsOfService.summary,
};

export default function TermsPage() {
	return <LegalDocumentView document={termsOfService} />;
}
