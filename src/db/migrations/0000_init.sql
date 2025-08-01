CREATE TABLE `user` (
    `id` text PRIMARY KEY NOT NULL,
    `createdAt` integer NOT NULL,
    `updatedAt` integer NOT NULL,
    `firstName` text(255),
    `lastName` text(255),
    `email` text(255),
    `passwordHash` text,
    `role` text DEFAULT 'user' NOT NULL
);

CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);

-- 🔐 INSERT DEV USER
INSERT INTO
    `user` (
        id,
        createdAt,
        updatedAt,
        firstName,
        lastName,
        email,
        passwordHash,
        role
    )
VALUES (
        'dev-user-1',
        strftime('%s', 'now'),
        strftime('%s', 'now'),
        'Csaba',
        'Polyak',
        'csiberius@gmail.com',
        '8f8409e43374ffa2f3b5981887e36a52:d5d672eceec331f461e458218dac7183f61befe746afe907754111e5d53de40f',
        'admin'
    );