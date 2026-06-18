"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { authFetch, clearClientSessionToken } from "@/lib/auth/client";

export function LogoutButton() {
	const t = useTranslations("nav");
	const router = useRouter();
	return (
		<Button
			variant="outline"
			className="w-full"
			onClick={async () => {
				await authFetch("/api/auth/logout", { method: "POST", redirectOnUnauthorized: false });
				clearClientSessionToken();
				router.push("/login");
			}}
		>
			{t("logOut")}
		</Button>
	);
}
