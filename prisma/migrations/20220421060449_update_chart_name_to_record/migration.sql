/*
  Warnings:

  - You are about to drop the `Chart` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Chart` DROP FOREIGN KEY `Chart_callId_fkey`;

-- DropTable
DROP TABLE `Chart`;

-- CreateTable
CREATE TABLE `Record` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `observation` VARCHAR(100) NULL,
    `diagnosis` VARCHAR(100) NOT NULL,
    `callId` INTEGER NOT NULL,

    UNIQUE INDEX `Record_callId_key`(`callId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Record` ADD CONSTRAINT `Record_callId_fkey` FOREIGN KEY (`callId`) REFERENCES `Call`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
