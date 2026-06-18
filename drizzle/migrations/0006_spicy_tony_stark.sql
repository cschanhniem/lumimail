CREATE TABLE `message_filters` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`from_contains` text,
	`to_contains` text,
	`subject_contains` text,
	`has_words` text,
	`action_star` integer DEFAULT false NOT NULL,
	`action_mark_read` integer DEFAULT false NOT NULL,
	`action_archive` integer DEFAULT false NOT NULL,
	`action_label_id` text,
	`action_move_to_trash` integer DEFAULT false NOT NULL,
	`enabled` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`action_label_id`) REFERENCES `labels`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `vacation_responders` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`enabled` integer DEFAULT false NOT NULL,
	`subject` text DEFAULT 'Out of office' NOT NULL,
	`body` text DEFAULT 'I am currently out of office and will reply when I return.' NOT NULL,
	`start_date` integer,
	`end_date` integer,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `vacation_responders_user_id_unique` ON `vacation_responders` (`user_id`);