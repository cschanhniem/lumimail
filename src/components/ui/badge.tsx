import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
	"inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
	{
		variants: {
			variant: {
				success: "bg-[var(--surface-subtle)] text-[var(--success)]",
				default: "bg-[var(--surface-subtle)] text-[var(--ink-muted)]",
				secondary: "bg-[var(--surface-subtle)] text-[var(--ink-muted)]",
				outline: "border border-[var(--border)] text-[var(--ink-muted)]",
			},
		},
		defaultVariants: { variant: "default" },
	},
);

export function Badge({
	className,
	variant,
	...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
	return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
