import { CurrentMailboxForm } from "@/components/settings/current-mailbox-form";
import { VacationResponderForm } from "@/components/settings/vacation-responder-form";
import { ChangePasswordForm } from "@/components/settings/change-password-form";

export default function SettingsPage() {
	return (
		<div className="space-y-6 max-w-2xl">
			<CurrentMailboxForm />
			<VacationResponderForm />
			<ChangePasswordForm />
		</div>
	);
}
