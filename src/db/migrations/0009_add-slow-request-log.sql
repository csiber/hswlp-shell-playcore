CREATE TABLE `slow_request_log` (
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`updateCounter` integer DEFAULT 0,
	`id` text PRIMARY KEY NOT NULL,
	`url` text NOT NULL,
	`durationMs` integer NOT NULL,
	`userId` text,
	`sessionHash` text(64),
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `slow_request_log_url_idx` ON `slow_request_log` (`url`);--> statement-breakpoint
CREATE INDEX `slow_request_log_user_idx` ON `slow_request_log` (`userId`);