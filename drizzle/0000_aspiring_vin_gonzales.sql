CREATE TABLE `attendances` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`check_in` integer NOT NULL,
	`shift` text NOT NULL,
	`similarity_score` real,
	`status` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `engine_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`date` text NOT NULL,
	`hour` text NOT NULL,
	`temperature_ambient` real,
	`daya_nyata` real,
	`daya_semu` real,
	`daya_reaktif` real,
	`power_factor` real,
	`voltage` real,
	`current_alternator` real,
	`current_acb` real,
	`exhaust_temp` real,
	`speed_engine` real,
	`oil_temperature` real,
	`oil_pressure` real,
	`main_circuit_water_temp` real,
	`intake_manifold_temp` real,
	`auxiliary_circuit_water_temp` real,
	`air_temperature` real,
	`closed_loop` real,
	`throttle_setpoint` real,
	`instability` real,
	`ignition_unit` real,
	`tecjet_position` real,
	`delta_p_over_tecjet` real,
	`fuel_temp_tecjet` real,
	`pressure_gas` real,
	`gas_flow` real,
	`total_operational_hour` real,
	`total_generated_power` real,
	`kondisi_pendukung` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `limbah_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`date` text NOT NULL,
	`hour` text NOT NULL,
	`level_tank_1` real,
	`level_tank_2` real,
	`drain_duration` real,
	`circulation_pump` integer,
	`adding_pump` integer,
	`air_injection` real,
	`temp_overflow` real,
	`warna_overflow` text,
	`ph_liquid` real,
	`unit_pompa_tambahan` text,
	`cek_gas_lagoon` text,
	`remark` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `report_approvals` (
	`id` text PRIMARY KEY NOT NULL,
	`report_date` text NOT NULL,
	`department` text NOT NULL,
	`supervisor_id` text,
	`supervisor_signature` text,
	`supervisor_approved_at` integer,
	`manager_id` text,
	`manager_signature` text,
	`manager_approved_at` integer,
	FOREIGN KEY (`supervisor_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`manager_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`clerk_id` text NOT NULL,
	`face_descriptor` text,
	`department` text NOT NULL,
	`role` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_clerk_id_unique` ON `users` (`clerk_id`);