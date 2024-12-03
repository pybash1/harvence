CREATE TABLE `history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`barcode` text NOT NULL,
	`quantity` text,
	`nutrition` text,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP)
);
